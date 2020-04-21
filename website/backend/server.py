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
#   Current connected port (In usage)
conn_port = set([config.CLIENT_ENDPOINT_PORT, config.API_ENDPOINT_PORT, config.STREAM_ENDPOINT_PORT])
pd_users_process = {}

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
        print(f'{request.sid} is not in connected users lists')
        pass

@socketio.on('set_control')
def set_control(control_data: dict):
    #   Send an update event
    user_id = request.sid
    if user_id in conn_users:
        user: User
        user = conn_users.get(user_id)
        user.audio_conf.update(control_data)
        pd_socket = Pd('localhost', user.port)
        # pd_socket.send(f'{control_data["reverb"]} {control_data["delay"]} {control_data["damp"]}')
        pd_socket.send_async(user.audio_conf_as_pd_payload())
        print('Sending payload as')
        print(user.audio_conf_as_pd_payload())
        print(f'{user_id} updated his control')
        for control, value in control_data.items():
            print(control, value)

@socketio.on('user_join')
def on_join():
    # TODO
    user_id = request.sid
    if user_id not in joined_users and user_id in conn_users:
        user: User
        user = conn_users[user_id]
        joined_users[user_id] = user
        # base_pd_path = './example.pd'
        base_pd_path = './base.pd'
        user_pd_path = f'./{user.port}.pd'
        print(f'{user.id} joined the stream')
        #   Set new pd patch file
        pd_patch = Pd_Patch(base_pd_path)
        #   TODO    Set mountpoint etc
        #   Stream mountpoint is the 1st in the file
        #   Raw Audio mountpoint is the 2nd in the file
        #   1-based index, not 0
        stream_mountpoint = f'stream{user.port}.mp3'
        raw_mountpoint = f'raw{user.port}.mp3'
        pd_patch.set_mountpoint(stream_mountpoint, which_occurence=1)
        pd_patch.set_mountpoint(raw_mountpoint, which_occurence=2)
        pd_patch.set_port_netreceive(f'{user.port}', user_pd_path)
        #   Open new pd subprocess with new pd patch
        if user_id not in pd_users_process:
            print(f'Opening new pd process on port {user.port}')
            p = subprocess.Popen(['pd', '-nogui', user_pd_path])
            pd_users_process[user_id] = p
        #   Send default pd input
        pd_socket = Pd('localhost', user.port)
        # pd_socket.send_async(f'{user.audio_conf["reverb"]} {user.audio_conf["delay"]} {user.audio_conf["damp"]}', repeat_until_connect=True)
        pd_socket.send(user.audio_conf_as_pd_payload(), repeat_until_connect=True)
        icecast_url = f'http://{util.get_ip_address()}:{config.STREAM_ENDPOINT_PORT}'
        #   Wait for pd to successfully connect to icecast. Bad dirty way but quick and simple
        socketio.sleep(1)
        socketio.emit('stream', {
            'source': f'{icecast_url}/{stream_mountpoint}',
            'raw': f'{icecast_url}/{raw_mountpoint}' 
        })



        

if __name__ == "__main__":
    ip = util.get_ip_address()
    print(f'To access externally, open this address from your device {ip}')
    #   Write/Update json config
    import json
    import shutil
    import os
    import ntpath
    with open('../frontend/src/config.json', mode='w') as file:
        json.dump({    
            "endpoint_port": str(config.API_ENDPOINT_PORT),
            "endpoint_ip": ip
        }, file)
    
    #   Copy file from ../sound to this directory.
    for file in util.iterateFilesFromDir('../../sound', file_type='.pd'):
        file_name = ntpath.basename(file)
        shutil.copyfile(file, f'./{file_name}')
        if file_name == 'main.pd':
            shutil.copyfile(file, './base.pd')

    #   Run Webserver
    socketio.run(app, host="0.0.0.0", port=config.API_ENDPOINT_PORT)