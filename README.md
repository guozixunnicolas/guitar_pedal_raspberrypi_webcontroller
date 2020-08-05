# DIP Project

A Live Audio Streaming Platform. This enables a speaker to stream
the audio live and have the audio control on a webserver which everyone on the same network can access, hence a "Smart" IOT.

Please find the demo video [here](https://youtu.be/slG2O9yKhXc).

## Getting Started

1. Install [Pure Data](https://puredata.info/).
2. Have [Python 3](https://www.python.org/) installed.
3. Install [node.js](https://nodejs.org/en/).
4. Install [IceCast](http://icecast.org/).

## Usage

Start Icecast server
```bash
icecast -c /path/to/icecast.xml
```
Install dependancies and start backend server
```bash
source env/bin/activate
cd website/backend
pip install -r requirements.txt
python server.py
```

Install frontend dependancies and start it
```bash
cd website/frontend
npm install
npm start
```
