import socket
import time
from multiprocessing import Process

class Pd(object):
    def __init__(self, host: str, port: int):
        self.HOST = host
        self.PORT = port
        self._wait_time = 1

    def send(self, arg: str, repeat_until_connect: bool = False, delay: int = 0):
        while True:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    time.sleep(delay)
                    s.connect((self.HOST, self.PORT))
                    if(not arg.endswith(';')):
                        arg += ';'
                    s.sendall(arg.encode('utf-8'))
                    print(f'Connection accepted')
                    return True
                except ConnectionRefusedError:
                    print(f'Connection to {self.HOST}:{self.PORT} refused')
                    if not repeat_until_connect:
                        return False
                    else:
                        time.sleep(self._wait_time)

    def send_async(self, arg: str, repeat_until_connect: bool = False, delay: int = 0):
        p = Process(target=self.send, args=(arg, repeat_until_connect, delay))
        p.start()

if __name__ == "__main__":
    a = Pd('localhost', 123)
    a.send_async('1.5 1 2', repeat_until_connect=True)