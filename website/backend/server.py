import flask
from User import User
import config as config
import util as util
from flask import Flask, render_template, Response, jsonify, request, Response, url_for
from flask_socketio import SocketIO
from flask_cors import CORS
import os
import async_stream
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'M,:Dhrd>U9Y/[fglzVr$f#={Y7PPvabElCt@CTi"I+9~Im+&F%h+O{g=oV#+%os'
app.debug = True
socketio = SocketIO(app)
CORS(app)
conn_users = {}
joined_users = {}

def genHeader(sampleRate, bitsPerSample, channels):
    datasize = 2000*10**6
    o = bytes("RIFF",'ascii')                                               # (4byte) Marks file as RIFF
    o += (datasize + 36).to_bytes(4,'little')                               # (4byte) File size in bytes excluding this and RIFF marker
    o += bytes("WAVE",'ascii')                                              # (4byte) File type
    o += bytes("fmt ",'ascii')                                              # (4byte) Format Chunk Marker
    o += (16).to_bytes(4,'little')                                          # (4byte) Length of above format data
    o += (1).to_bytes(2,'little')                                           # (2byte) Format type (1 - PCM)
    o += (channels).to_bytes(2,'little')                                    # (2byte)
    o += (sampleRate).to_bytes(4,'little')                                  # (4byte)
    o += (sampleRate * channels * bitsPerSample // 8).to_bytes(4,'little')  # (4byte)
    o += (channels * bitsPerSample // 8).to_bytes(2,'little')               # (2byte)
    o += (bitsPerSample).to_bytes(2,'little')                               # (2byte)
    o += bytes("data",'ascii')                                              # (4byte) Data Chunk Marker
    o += (datasize).to_bytes(4,'little')                                    # (4byte) Data size in bytes
    return o

def read_in_chunks(file_object, chunk_size=1024):
    """Lazy function (generator) to read a file piece by piece.
    Default chunk size: 1k."""
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data

@app.route('/')
def show_control():
    #   TODO
    #   Later on implement audio button here, just to be able to do things.
    return render_template('music.html')

def get_audio(*args, **kwargs):
    #   Stream chunks audio here
    # with open('./music/bios.mp3', 'rb') as f:
    #     for chunks in read_in_chunks(f):
    #         yield(chunks)
    for audio in async_stream.get_audio():
        yield(audio)

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
    socketio.emit('user_connected', {'control': control})

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
        i_off = 0
        header = genHeader(config.RATE, config.BITS_PER_SAMPLE, config.CHANNELS)
        package = [header]
        for audio in get_audio():
            if i_off != config.N_CHUNKS:
                package.append(audio)
            else:
                payload = b"".join(package)
                socketio.emit('audio_get_chunk', {'audio': payload})
                socketio.sleep(0)
                package = [header]
            i_off = (i_off + 1) % (config.N_CHUNKS + 1)

if __name__ == "__main__":
    ip = util.get_ip_address()
    print(f'To access externally, open this address from your device {ip}')
    socketio.run(app, host="0.0.0.0", port=5000)