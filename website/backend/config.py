import json
#   Stream
N_CHUNKS = 1

#   Pyaudio
CHANNELS = 2
RATE = 44100
CHUNK = 1536
BITS_PER_SAMPLE = 16

#   Webserver Config
API_ENDPOINT_PORT = 5000
CLIENT_ENDPOINT_PORT = 3000
STREAM_ENDPOINT_PORT = 8000

#   Pd Audio Control

default_control = {
    "equalizer": [int(_) for _ in "0" * 8],
    "fixed_preamp": 1,
    "fixed_bypass": 1,
    "reverb": 10,
    "roomsize": 0,
    "damp": 0,
    "dry": 0,
    "wet": 0,
    "delay": 0,
    "fixed_val": 0,
    "fixed_record": 0,
    "fixed_tempo": 0,
    "fixed_clear": 0,
    "fixed_audio": 0,
    "fixed_reverse": 0
}

#   fixed_<field> is readonly by server. Not writeable from client.

#   1-8 eq band value (0,1)
#   9 eq preamp (0, 1)
#   10 eq bypass (0 / 1)

#   11,12,13,14 reverb roomsize, damp, dry, wet

#   15, 16 delay time, val

#   16-20 record, tempo, clear, audio on/off, reverse

#   echo '0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.777 0 0.5 0.5 0.5 0.5 200 0.8 1 bang bang 1 bang;' | pdsend 15001 localhost


if __name__ == "__main__":
    with open('../frontend/src/config.json', mode='r') as file:
        print(json.load(file))