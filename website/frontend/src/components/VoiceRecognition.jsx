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
    
        
    // Set recognition language
    recognition.lang = "en-GB";


    // If browser not support SpeechRecognition then do not output anything
    if (!browserSupportsSpeechRecognition) {
        return null;
        }


    // Correct "Jess" to "Jazz"
    if (interimTranscript === "Jess") {
        interimTranscript = "Jazz"
    }
    

    // If mic is ON (currently listen)
    if (listening) {    
        return (
            <div>
                <button onClick={stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <span>{transcript}</span>
            </div>
            );
        }  
    

    // If mic is OFF (not listen)
    else {

        // If there is nothing in transcript
        if (transcript === "") {        
            return (
                <div>
                    <button onClick={startListening}>Start</button>
                    <button onClick={resetTranscript}>Reset</button>
                    <span>{transcript}</span>
                </div>
            );
        }
        
        // If there IS something in transcript
        else {                          
            return (
                <div>
                    <button onClick={resetTranscript}>Send Commands</button>
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