import config
import uuid
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
        assert 'equalizer' in self.audio_conf, 'Default config not found'
        return ", ".join([str(int_value) for int_value in [*self.audio_conf["equalizer"], *[_ for _ in self.audio_conf.values() if not isinstance(_, list)]]])

if __name__ == "__main__":
    user = User('123')
    print(user.audio_conf)
    print(user)