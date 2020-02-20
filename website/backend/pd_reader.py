import os

class Pd_Patch(object):
    def __init__(self, path: str):
        assert(os.path.isfile(path), "Path to patch doesn't exist")
        self.path = path
    
    def set_port_netreceive(self, value: str, new_path: str = None):
        lines = []
        write_path = new_path or self.path
        with open(self.path, 'r') as file:
            for line in file:
                if 'netreceive' in line:
                    args = line.split(' ')
                    args[-1] = str(value) + ';\n'
                    line = ' '.join(args)
                lines.append(line)

        with open(write_path, 'w') as file:
            file.writelines(lines)

        return write_path


