import os

class Pd_Patch(object):
    def __init__(self, path: str):
        assert os.path.isfile(path), "Path to patch doesn't exist"
        self.path = path
    
    def __set_custom_field(self, field: str, value: str, new_path: str = None, which_occurence: int = None):
        lines = []
        write_path = new_path or self.path
        occurence = 1
        with open(self.path, 'r') as file:
            for line in file:
                if field in line:
                    if which_occurence is None or occurence == which_occurence:
                        args = line.split(' ')
                        args[-1] = str(value) + ';\n'
                        line = ' '.join(args)
                    occurence = occurence + 1
                lines.append(line)

        with open(write_path, 'w') as file:
            file.writelines(lines)

        return write_path


    def set_port_netreceive(self, value: str, new_path: str = None, which_occurence: int = None):
        write_path = self.__set_custom_field('netreceive', value, new_path, which_occurence)
        return write_path

    def set_mountpoint(self, value: str, new_path: str = None, which_occurence: int = None):
        write_path = self.__set_custom_field('mountpoint', value, new_path, which_occurence)
        return write_path

    def set_port_stream(self, value: str, new_path: str = None, which_occurence: int = None):
        write_path = self.__set_custom_field('localhost', value, new_path, which_occurence)
        return write_path



