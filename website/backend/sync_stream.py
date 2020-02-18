import pyaudio
import wave
import sys

def get_audio():
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 2
    RATE = 44100
    RECORD_SECONDS = 5
# instantiate PyAudio (1)
    audio = pyaudio.PyAudio()

    stream = audio.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    output=True,
                    frames_per_buffer=CHUNK)
                    
    frames = []

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)
        yield(data)

    # stop stream (4)
    stream.stop_stream()
    stream.close()

    # close PyAudio (5)
    audio.terminate()

if __name__ == "__main__":
    [i for i in get_audio()]