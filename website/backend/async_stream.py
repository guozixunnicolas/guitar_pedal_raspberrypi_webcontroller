import pyaudio
import time

WIDTH = 2
CHANNELS = 2
RATE = 44100
CHUNK = 1024
data = b''

def get_audio():
    p = pyaudio.PyAudio()

    def callback(in_data, frame_count, time_info, status):
        global data
        data = in_data
        return (in_data, pyaudio.paContinue)

    stream = p.open(format=p.get_format_from_width(WIDTH),
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