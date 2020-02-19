import pyaudio
import time
import config

FORMAT = pyaudio.paInt32
CHANNELS = config.CHANNELS
RATE = config.RATE
CHUNK = config.CHUNK
data = b''

def get_audio():
    p = pyaudio.PyAudio()

    def callback(in_data, frame_count, time_info, status):
        global data
        data = in_data
        return (in_data, pyaudio.paContinue)

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    stream_callback=callback,
                    frames_per_buffer=CHUNK)

    stream.start_stream()

    while stream.is_active():
        yield(data)

    stream.stop_stream()
    stream.close()

    p.terminate()

if __name__ == "__main__":
    for data in get_audio():
        print(data)
        time.sleep(1)