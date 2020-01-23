import flask
from User import User
import config as config
import util as util
from flask import Flask, render_template, Response, jsonify, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'M,:Dhrd>U9Y/[fglzVr$f#={Y7PPvabElCt@CTi"I+9~Im+&F%h+O{g=oV#+%os'
app.debug = True
socketio = SocketIO(app)
conn_users = {}

@app.route('/')
def show_control():
    #   TODO
    #   Later on implement audio button here, just to be able to do things.
    return render_template('main.html')

@app.route('/users')
def get_users():
    return render_template('users.html', conn_users=conn_users)

@socketio.on("connect")
def on_connect():
    new_user = User(request.sid, request)
    if new_user not in conn_users:
        conn_users[new_user.id] = new_user
        print(f'{new_user.id} connected, setting default value')
        control = new_user.audio_conf
    else:
        control = config.default_control
    socketio.emit('init_control', control)

@socketio.on("disconnect")
def on_disconnect():
    try:
        conn_users.pop(request.sid)
        print(f'{request.sid} disconnected')
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
    for control, value in control_data.items():
        # Set control here for example:
        # lib.audio.set_control(control, value)
        print(request.sid, control, value)

if __name__ == "__main__":
    ip = util.get_ip_address()
    print(f'To access externally, open this address from your device {ip}')
    socketio.run(app, host="0.0.0.0")