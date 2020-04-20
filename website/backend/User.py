import config
import uuid
import functools

def key_is_not_in_list(word_list: list, key: str) -> bool:
    return functools.reduce(lambda a, b: a and b, [_ not in key for _ in word_list])
class User(object):
    def __init__(self, uid: str = None, request = None, port: int = None):
        self.id = uid if uid is not None else uuid.uuid4()
        self.audio_conf = config.default_control
        self.port = port

    def as_json(self):
        return {
            'id': self.id,
            'audio_conf': self.audio_conf
        }
    
    def audio_conf_as_pd_payload(self):
        '''
        Flatten the audio_conf as a string joined by " " and applying neccessary normalization
        Eg: 
        "equalizer": [1, 2, 3, 4, 5, 6, 7, 8],
        "not normalized": 100,
        "will be normalized by 100": 200
        =>
        1 2 3 4 5 6 7 8 100 2
        '''
        assert 'equalizer' in self.audio_conf, 'Default config not found'
        return " ".join([
            str(int_value) for int_value in [
                *[eq_val / config.EQUALIZER_NORMALIZED_CONST for eq_val in self.audio_conf["equalizer"]], 
                *[val / config.CONTROLS_NORMALIZED_CONST if key_is_not_in_list(config.NOT_NORMALIZED_CONST_PREFIX, key) else val for key, val in self.audio_conf.items() if not isinstance(val, list)]
            ]
        ])

if __name__ == "__main__":
    user = User('123')
    print(user.audio_conf)
    print(user)