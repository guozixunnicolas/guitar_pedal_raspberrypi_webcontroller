#!/bin/bash -e
# pid list to kill
pids=( )
# define cleanup func
cleanup() {
	for pid in "${pids[@]}"; do
		kill -0 "$pid" && kill "$pid" #kill process if running
	done
}
# trap when EXIT signal is received
trap cleanup EXIT TERM

cd /home/pi/Documents/DIP
source /home/pi/Documents/DIP/env/bin/activate
cd website/backend
python server.py & pids+=( "$!" )
cd ..
cd frontend
npm start & pids+=( "$!" )
ip=`hostname -I | cut -d' ' -f1`
address="http://${ip}:3000"
message="Running Audio Livestream Webserver on $address"
echo $message
wait
