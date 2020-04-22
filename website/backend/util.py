import socket
import random
import os

def unique_random_n_digits(digit: int, cur_digit: set()):
    start = 10**(digit - 1)
    end = (10**digit) - 1
    num = random.randint(start, end)
    if len(cur_digit) == end - start + 1:
        return False
    else:
        while num in cur_digit:
            num = random.randint(start, end)
        return num

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]
    
def iterateFilesFromDir(path: str, file_type: str = None):
    for root, _, files in os.walk(path):
        for file in files:
            if file_type is not None:
                if file_type in file:
                    yield os.path.join(root, file)
            else:
                yield os.path.join(root, file)

def shut_down_pi():
    import platform
    isPi = platform.uname()[1] == 'raspberrypi'
    if isPi:
        command = "/usr/bin/sudo /sbin/shutdown -h now"
        import subprocess
        process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
        output = process.communicate()[0]
        return f'Shutting down with code {output}'
    else:
        return 'Not running on raspberrypi, aborting shutdown'

def restart_pi():
    import platform
    isPi = platform.uname()[1] == 'raspberrypi'
    if isPi:
        command = "/usr/bin/sudo /sbin/shutdown -r now"
        import subprocess
        process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
        output = process.communicate()[0]
        return f'Restarting with code {output}'
    else:
        return 'Not running on raspberrypi, aborting restart'

def pi_to_discwebhook(message: str, url: str, embed: dict = {}) -> str:
    import platform
    isPi = platform.uname()[1] == 'raspberrypi'
    if isPi:
        import requests
        import json
        content = '{"content": $msg_content}'
        content.replace('$msg_content', f'"{message}"')
        header = {'Content-Type': 'application/json'}
        data = {}
        data["content"] = message
        data["embeds"] = []
        data["embeds"].append(embed) if len(embed) else {}
        result = requests.post(url=url, data=json.dumps(data), headers=header)
        try:
            result.raise_for_status()
        except requests.exceptions.HTTPError as err:
            print(err)
        else:
            print("Payload delivered successfully, code {}.".format(result.status_code))
            return "Sent to Discord succesfully code {}.".format(result.status_code)
    else:
        return None

if __name__ == "__main__":
    import timeit
    print(timeit.timeit("unique_random_n_digits(1, {1, 2, 3, 4, 5, 6, 7, 8})", setup="from __main__ import unique_random_n_digits", number=10000))
    print(unique_random_n_digits(1, {1, 2, 3, 4, 5, 6, 7, 8, 9}))