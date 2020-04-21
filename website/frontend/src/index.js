import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
// import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Control from './components/ControlBar';
import Bang from './components/ControlBang';
import EqualizerButton from './components/EqualizerBar';
import config from './config.json';
import VoiceRecognition from './components/VoiceRecognition';
import Canvas from './components/Canvas'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io.connect(`${config.endpoint_ip}:${config.endpoint_port}`);
        this.state = {
            controls: {
                equalizer: {
                    value: Array(8).fill(1),
                    min: 1,
                    max: 10,
                    step: 1
                },
                volume: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                roomsize: {
                    value: 0,
                    min: 0,
                    max: 100,
                    step: 1
                },
                damp: {
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
                },
                delay: {
                    value: 0,
                    min: 0,
                    max: 1000,
                    step: 1
                },
                "record": {
                    value: 0,
                    min: 0,
                    max: 1,
                    step: 1
                },
                "looper tempo": {
                    value: "bang",
                    min: 0,
                    max: 1,
                    step: 1
                },
                "looper clear": {
                    value: "bang",
                    min: 0,
                    max: 1,
                    step: 1
                },
                "looper reverse": {
                    value: "bang",
                    min: 0,
                    max: 1,
                    step: 1
                },
            },
            isStreaming: false,
            streamSource: null,
            rawSource: null,
            fieldsetRef: React.createRef(),
            streamRef: React.createRef(),
            rawRef: React.createRef()
        }
    }
    setSocketListeners() {
        this.socket.on('user_connected', (data) => {
            let controls = this.state.controls;
            for (const attribute in data.control) {
                if (attribute in controls) {
                    controls[attribute].value = data.control[attribute];
                }
            }
            this.setState({
                controls: controls
            })
        });
        this.socket.on('stream', (data) => {
            this.setState({
                isStreaming: true,
                streamSource: data.source,
                rawSource: data.raw
            })
        });
    }
    componentDidMount() {
        this.setSocketListeners();
        let fixed = this.state.fieldsetRef.current;
        //  Disable scrolling inside the fieldset when using mobile
        fixed.addEventListener('touchmove', (e) => {}, false);
    }
    handleControlChange(event) {
        let controls = this.state.controls;
        let id = event.target.id;
        if (String(id).startsWith('equalizer')) {
            //  id is equalizer-<eq_no>
            const eq_no = parseInt(id.split('-')[1]);
            controls['equalizer'].value[eq_no] = parseInt(event.target.value);
        }
        else {
            if (String(id).startsWith('looper'))
                controls[id].value = event.target.value === "bang" ? event.target.value : parseInt(event.target.value);
            else
                controls[id].value = parseInt(event.target.value);
        }
        this.setState({
            controls: controls
        });
    }
    handleUserJoin(isUserFirstJoin) {
        console.log('Joining');
        if (isUserFirstJoin) {
            this.socket.emit('user_join');
        }
    }
    // Handle submitting control when the values are changed via socket connection
    submitControl(event) {
        let controls = this.state.controls;
        let payload = {};
        for (const data in controls) {
            payload[data] = controls[data].value;
        }
        this.socket.emit('set_control', payload);
    }
    generateControls() {
        let controls = [];
        let cur_controls = this.state.controls;
        for (const key in cur_controls) {
            if (key === 'equalizer') {
                let enclosure = [];
                let eq_length = cur_controls[key].value.length;
                enclosure.push(<label orient='270deg' type='range' key={`${key}-label-start`} htmlFor="band" before={this.state.controls.equalizer.min} after={this.state.controls.equalizer.max}>{this.state.controls.equalizer.max / 2}</label>);
                for (let x = 0; x < eq_length; x++) {
                    enclosure.push(<Control onMouseUpCapture={(e) => this.submitControl(e)} onChange={(e) => this.handleControlChange(e)} key={`${key.toLowerCase()}-${x}`} min={cur_controls[key].min} max={cur_controls[key].max} value={cur_controls[key].value[x]} label={`${key.toLowerCase()}-${x}`} step={cur_controls[key].step} orient="270deg" className="equalizer" noLabelLegend={true} />)
                }
                enclosure.push(<label orient='90deg' type='range' key={`${key}-label-end`} htmlFor="band" before={this.state.controls.equalizer.max} after={this.state.controls.equalizer.min}>{this.state.controls.equalizer.max / 2}</label>);
                controls.push(<div id="equalizer-board" key={`${key}-board`}>{enclosure}</div>)
            }
            else {
                let isBoolControl = (cur_controls[key].max - cur_controls[key].min + 1) / cur_controls[key].step === 2 ? true : false;
                if (isBoolControl)
                    controls.push(<Bang onSubmit={(e) => this.submitControl(e)} onChange={(e) => this.handleControlChange(e)} key={key.toLowerCase()} value={cur_controls[key].value} label={key.toLowerCase()} bang={key.toLowerCase().startsWith('looper')} className={key.toLowerCase().startsWith('looper') ? "bang__input" : "tgl tgl-skewed"} />);
                else
                    controls.push(<Control onMouseUpCapture={(e) => this.submitControl(e)} onChange={(e) => this.handleControlChange(e)} key={key.toLowerCase()} min={cur_controls[key].min} max={cur_controls[key].max} value={cur_controls[key].value} label={key.toLowerCase()} step={cur_controls[key].step} className="control" />)
            }
        }
        return controls;
    }
    render() {
        return (
            <div id='app'>
                <fieldset ref={this.state.fieldsetRef}>
                    <legend>Equalizer</legend>
                    {this.generateControls()}
                    <EqualizerButton onClick={(isUserFirstJoin) => this.handleUserJoin(isUserFirstJoin)} />
                    {this.state.isStreaming && <audio crossOrigin="anonymous" autoPlay src={this.state.streamSource} id='audio_stream_data' ref={this.state.streamRef} />}
                    {this.state.isStreaming && <audio crossOrigin="anonymous" autoPlay muted={true} src={this.state.rawSource} id='audio_stream_raw' ref={this.state.rawRef} />}
                </fieldset>
                {/* <VoiceRecognition></VoiceRecognition>
                {this.state.isStreaming && this.state.streamRef.current && this.state.rawRef.current &&
                    <fieldset>
                        <Canvas rawSource={this.state.rawRef.current} streamSource={this.state.streamRef.current} />
                    </fieldset>
                } */}
            </div>
        )
    }
}

// ========================================

ReactDOM.render(
    <App></App>,
    document.getElementById('root')
);
