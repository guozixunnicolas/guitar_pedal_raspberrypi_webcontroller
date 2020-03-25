import json
#   Stream
N_CHUNKS = 1

#   Pyaudio
CHANNELS = 2
RATE = 44100
CHUNK = 1536
BITS_PER_SAMPLE = 16
API_ENDPOINT_PORT = 5000
CLIENT_ENDPOINT_PORT = 3000
STREAM_ENDPOINT_PORT = 8000

default_control = {
    "gain": 10,
    "delay": 0,
    "reverb": 0
}

if __name__ == "__main__":
    with open('../frontend/src/config.json', mode='r') as file:
        print(json.load(file))