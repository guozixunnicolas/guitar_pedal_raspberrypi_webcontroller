import pyaudio
import time
import config
import sys

FORMAT = pyaudio.paInt16
CHANNELS = config.CHANNELS
RATE = config.RATE
CHUNK = config.CHUNK
data = b''


def genHeader(sampleRate, bitsPerSample, channels):
    datasize = 49640
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

def get_audio():
    p = pyaudio.PyAudio()

    def callback(in_data, frame_count, time_info, status):
        global data
        data = genHeader(RATE, config.BITS_PER_SAMPLE, CHANNELS) + in_data
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
        print(sys.getsizeof(data))
        time.sleep(1)