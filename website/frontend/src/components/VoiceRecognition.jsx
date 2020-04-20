import React from 'react';
import PropTypes from 'prop-types';
import SpeechRecognition from 'react-speech-recognition';

const propTypes = {
    // Props injected by SpeechRecognition
    transcript: PropTypes.string,
    resetTranscript: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool,
    listening: PropTypes.bool,
    startListening: PropTypes.func,
    stopListening: PropTypes.func,
    interimTranscript: PropTypes.string,
    recognition: PropTypes.object
    };

const Dictaphone = ({
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
    startListening,
    stopListening,
    interimTranscript,
    recognition
    }) => {

    recognition.lang = "en-GB";

    if (!browserSupportsSpeechRecognition) {
        return null;
        }

    if (interimTranscript === "Jess") {
        interimTranscript = "Jazz"
    }
    
    if (listening) {
        return (
            <div>
                <button onClick={stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <span>{transcript}</span>
            </div>
            );
        }  
    else {
        if (transcript === "") {
            return (
                <div>
                    <button onClick={startListening}>Start</button>
                    <button onClick={resetTranscript}>Reset</button>
                    <span>{transcript}</span>
                </div>
            );
        }
        else {
            return (
                <div>
                    <button onClick={startListening}>Send Commands</button>
                    <button onClick={resetTranscript}>Reset</button>
                    <span>{transcript}</span>
                </div>
            );
        }
        
        }
    };

const options = {
    autoStart: false,
    continuous: true
    }

Dictaphone.propTypes = propTypes

export default SpeechRecognition(options)(Dictaphone);