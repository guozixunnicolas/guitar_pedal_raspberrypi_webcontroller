import flask
from User import User
import config as config
import util as util
from flask import Flask, render_template, Response, jsonify, request, Response
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'M,:Dhrd>U9Y/[fglzVr$f#={Y7PPvabElCt@CTi"I+9~Im+&F%h+O{g=oV#+%os'
app.debug = True
socketio = SocketIO(app)
CORS(app)
conn_users = {}
joined_users = {}

@app.route('/')
def show_control():
    #   TODO
    #   Later on implement audio button here, just to be able to do things.
    return render_template('music.html')

def get_audio(*args, **kwargs):
    with open('./music/bios.mp3', 'rb') as f:
        data = f.read()
    return data


@app.route('/users')
def get_users():
    return render_template('users.html', conn_users=conn_users)

@socketio.on("connect")
def on_connect():
    new_user = User(request.sid, request)
    if new_user not in conn_users:
        conn_users[new_user.id] = new_user
        print(f'{new_user.id} connected')
        control = new_user.audio_conf
    else:
        control = config.default_control
    socketio.emit('user_connected', {'control': control, 'audio': get_audio()})

@socketio.on("disconnect")
def on_disconnect():
    try:
        disconnected_user: User
        disconnected_user = conn_users.pop(request.sid)
        print(f'{request.sid} disconnected')
        print(f'emitting event user_disconnected {disconnected_user.as_json()}')
        socketio.emit('user_disconnected', {'user': disconnected_user.as_json()})
        joined_users.pop(request.sid)
    except KeyError:
        pass

@socketio.on('set_control')
def set_control(control_data: dict):
    #   Send an update event
    if request.sid in conn_users:
        print(f'{request.sid} updated his control')
        cur_user: User
        cur_user = conn_users.get(request.sid)
        cur_user.audio_conf = control_data
        print((conn_users.get(request.sid)).audio_conf)
        print(f'emitting event update_control {cur_user.as_json()}')
        socketio.emit('update_control', {'user': cur_user.as_json()})
    for control, value in control_data.items():
        print(request.sid, control, value)

@socketio.on('user_join')
def on_join():
    # TODO
    new_user = User(request.sid, request)
    if new_user not in joined_users:
        joined_users[new_user.id] = new_user
        print(f'{new_user.id} joined the stream')
        for audio in get_audio():
            socketio.emit('send_audio', {'audio': audio})


if __name__ == "__main__":
    ip = util.get_ip_address()
    print(f'To access externally, open this address from your device {ip}')
    socketio.run(app, host="0.0.0.0", port=5000)