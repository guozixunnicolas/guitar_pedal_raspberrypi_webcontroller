var message = document.querySelector("#message");

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

var grammar = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var speechRecognitionGrammarList = new SpeechGrammarList();
speechRecognitionGrammarList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionGrammarList;
recognition.lang = 'en-US';
recognition.interimResults = false;

recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;
    message.textContent = 'Voice Input: ' + command + '.';

        if(command.toLowerCase() === 'jess' || command.toLowerCase() === 'jazz' ){
            document.querySelector('#chkJazz').checked = true;
            message.textContent = 'Voice Input: ' + 'jazz.';
        }
        else if (command.toLowerCase() === 'start audio'){
            document.querySelector('#chkStart').checked = true;
        }
        else if (command.toLowerCase() === 'higher gain' || command.toLowerCase() === 'hi again'){
            document.querySelector('#chkGain').checked = true;
            message.textContent = 'Voice Input: ' + 'higer gain.';
        }
        else if (command.toLowerCase() === 'higher volume'){
            document.querySelector('#chkVol').checked = true;
        }   
        else if (command.toLowerCase() === 'hello'){
            message.textContent = 'Welcome!';
        }  
}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onerror = function(event) {
    message.textContent = 'Error occurred in recognition: ' + event.error;
}

document.querySelector('#btnGiveCommand').addEventListener('click', function(){
    message.textContent = '';
    recognition.start();
});