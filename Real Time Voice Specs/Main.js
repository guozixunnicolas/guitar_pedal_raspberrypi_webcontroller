// set up basic variables for app

var canvas = document.getElementById('visual');
var canvas2 = document.getElementById('visual2');

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext('2d');
const canvasCtx2 = canvas2.getContext('2d');

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);
  }

  let onError = function (err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

}

else {
  console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 32768;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var analyser2 = audioCtx.createAnalyser();
  analyser2.fftSize = 32768;
  var bufferLength2 = analyser2.frequencyBinCount;
  var dataArray2 = new Uint8Array(bufferLength2);

  source.connect(analyser);
  source.connect(analyser2);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {

    canvas.width = window.innerWidth * 0.98;
    canvas.height = window.innerHeight * 0.30;

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    canvas2.width = window.innerWidth * 0.98;
    canvas2.height = window.innerHeight * 0.30;

    WIDTH2 = canvas2.width;
    HEIGHT2 = canvas2.height;

    requestAnimationFrame(draw);

    analyser2.getByteTimeDomainData(dataArray2);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.fillStyle = 'brown';

    canvasCtx2.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx2.fillRect(0, 0, WIDTH2, HEIGHT2);
    canvasCtx2.lineWidth = 2;
    canvasCtx2.strokeStyle = 'blue';

    canvasCtx2.beginPath();

    let sliceWidth = WIDTH2 * 1.0 / bufferLength2;
    let x = 0;

    var bar = 16384;
    for (let i = 0; i < bufferLength2; i++) {

      var bar_x = i * 4;
      var bar_width = 3;
      var bar_height = -(dataArray[i] / 1);
      //  fillRect( x, y, width, height ) // Explanation of the parameters below
      canvasCtx.fillRect(bar_x, HEIGHT, bar_width, bar_height);


      let v = dataArray2[i] / 128.0;
      let y = v * HEIGHT2 / 2;

      if (i === 0) {
        canvasCtx2.moveTo(x, y);
      } else {
        canvasCtx2.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx2.lineTo(canvas2.width, canvas2.height / 2);
    canvasCtx2.stroke();

  }
}

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();