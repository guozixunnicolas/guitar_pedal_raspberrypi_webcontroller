function record() {
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    var douCon;

    recognition.onresult = function(event) {
       console.log(event);
       douCon = event.results[0][0].transcript;
    //    document.getElementById('confidence').innerHTML = event.results[0][0].confidence;

       if(douCon == "Jess"){
        document.getElementById('speechToText').value = "Jazz";
       }
       
       else{
        document.getElementById('speechToText').value = douCon;
       }
       
    }
    recognition.start();
}