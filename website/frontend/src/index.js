import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './index.css';
import Control from './components/ControlBar';
import config from './config.json';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io(config.endpoint);
        this.state = {
            controls: {
                equalizer: {
                    value: Array(8).fill(0),
                    min: Array(8).fill(0),
                    max: Array(8).fill(1),
                    step: Array(8).fill(0.01)
                },
                gain: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                reverb: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                delay: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                dry: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                wet: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                }
            }
        }
    }
    setSocketListeners() {
        this.socket.on('user_connected', (data) => {
            console.log(data)
        });
    }
    componentDidMount() {
        this.setSocketListeners();
    }
    handleControlChange() {
        this.socket.emit('set_control', {

        });
    }
    generateControls() {
        const controls = [];
        const cur_controls = this.state.controls;
        for(const key in cur_controls) {
            if(key === 'equalizer') {
                for(const field in cur_controls[key]) {
                    //  Implement this
                }
            }
            else {
                controls.push(<Control min={cur_controls[key].min} max={cur_controls[key].max} value={cur_controls[key].value} label={key.toUpperCase()} className='equalizer'></Control>)
            }
        }
        return controls;
    }
    render() {
        return (
            <div id='app'>
                {this.generateControls()}
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
);
