import flask
from User import User
import config as config
import util as util
from flask import Flask, render_template, Response, jsonify, request, Response, url_for
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import time
import subprocess
from pd_reader import Pd_Patch
from pd_socket import Pd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'M,:Dhrd>U9Y/[fglzVr$f#={Y7PPvabElCt@CTi"I+9~Im+&F%h+O{g=oV#+%os'
app.debug = True
CORS(app)
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins='*')

conn_users = {}
joined_users = {}
conn_port = set([config.CLIENT_ENDPOINT_PORT, config.API_ENDPOINT_PORT, config.STREAM_ENDPOINT_PORT])
pd_users_process = {}

@app.route('/')
def index():
    return render_template('music.html')

def read_in_chunks(file_object, chunk_size=1024):
    """Lazy function (generator) to read a file piece by piece.
    Default chunk size: 1k."""
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data

#   To prevent caching static files
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path, endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)

@socketio.on("connect")
def on_connect():
    new_user = User(request.sid, request, util.unique_random_n_digits(4, conn_port))
    if new_user not in conn_users:
        conn_users[new_user.id] = new_user
        conn_port.add(new_user.port)
        print(f'{new_user.id} connected')
        control = new_user.audio_conf
    else:
        control = config.default_control
    socketio.emit('user_connected', {'control': control})

@socketio.on("disconnect")
def on_disconnect():
    try:
        #   Pop user from connected user dict, and kill related process and pd file created by it.
        disconnected_user: User
        disconnected_user = conn_users.pop(request.sid)
        #   Remove the port allowing it to be used again
        conn_port.remove(disconnected_user.port)
        p = pd_users_process.pop(disconnected_user.id)
        if p.poll() == None:
            p.kill()
            #   Delete custom pd file
            try:
                os.remove(f'./{disconnected_user.port}.pd')
            except FileNotFoundError:
                pass
        print(f'{request.sid} disconnected')
        print(f'emitting event user_disconnected {disconnected_user.as_json()}')
        socketio.emit('user_disconnected', {'user': disconnected_user.as_json()})
        joined_users.pop(request.sid)
    except KeyError:
        pass

@socketio.on('set_control')
def set_control(control_data: dict):
    #   Send an update event
    user_id = request.sid
    if user_id in conn_users:
        print(f'{user_id} updated his control')
        cur_user: User
        cur_user = conn_users.get(user_id)
        cur_user.audio_conf = control_data
        print((conn_users.get(user_id)).audio_conf)
        print(f'emitting event update_control {cur_user.as_json()}')
        socketio.emit('update_control', {'user': cur_user.as_json()})
        pd_socket = Pd('localhost', cur_user.port)
        # TODO SEND CORRECT ARGS
        pd_socket.send(f'{control_data["gain"]} {control_data["delay"]} {control_data["reverb"]}')
        for control, value in control_data.items():
            print(user_id, control, value)

@socketio.on('user_join')
def on_join():
    # TODO
    user_id = request.sid
    if user_id not in joined_users and user_id in conn_users:
        user: User
        user = conn_users[user_id]
        joined_users[user_id] = user
        base_pd_path = './base.pd'
        user_pd_path = f'./{user.port}.pd'
        print(f'{user.id} joined the stream')
        #   Set new pd patch file
        pd_patch = Pd_Patch(base_pd_path)
        #   TODO    Set mountpoint etc
        pd_patch.set_mountpoint(user.port)
        pd_patch.set_port_netreceive(f'{user.port}', user_pd_path)
        #   Open new pd subprocess with new pd patch
        if user_id not in pd_users_process:
            print(f'Opening new pd process on port {user.port}')
            p = subprocess.Popen(['pd', '-nogui', user_pd_path])
            pd_users_process[user_id] = p
        #   Send default pd input
        pd_socket = Pd('localhost', user.port)
        pd_socket.send_async(f'{user.audio_conf["gain"]} {user.audio_conf["delay"]} {user.audio_conf["reverb"]}', repeat_until_connect=True)
        socketio.emit('stream', {'source': f'{util.get_ip_address()}:{config.STREAM_ENDPOINT_PORT}/{user.port}.mp3'})



        

if __name__ == "__main__":
    ip = util.get_ip_address()
    print(f'To access externally, open this address from your device {ip}')
    #   Write/Update json config
    import json
    with open('../frontend/src/config.json', mode='w') as file:
        json.dump({    
            "endpoint_port": str(config.API_ENDPOINT_PORT),
            "endpoint_ip": ip
        }, file)

    socketio.run(app, host="0.0.0.0", port=config.API_ENDPOINT_PORT)