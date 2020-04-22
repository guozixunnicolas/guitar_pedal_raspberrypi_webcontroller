// set up basic variables for app



// visualiser setup - create web audio api context and canvas

var audioCtx, audioCtx2;


// var audio = new Audio();
// audio.src = 'Seether - Tonight (Official Video).mp3';
// audio.controls = true;
// audio.loop = true;
// audio.autoplay = false;

// var audio2 = new Audio();
// audio2.src = 'Seether - Tonight (Official Video).mp3';
// audio2.controls = true;
// audio2.loop = true;
// audio2.autoplay = false;

function visualize() {
  var audioElement = document.getElementById("before_Proc");
  var audioElement2 = document.getElementById("after_Proc");
  audioCtx = new AudioContext();
  audioCtx2 = new AudioContext();
  var canvas = document.getElementById('visual');
  var canvas2 = document.getElementById('visual2');
  const canvasCtx = canvas.getContext('2d');
  const canvasCtx2 = canvas2.getContext('2d');
  var source = audioCtx.createMediaElementSource(audioElement);
  var source2 = audioCtx2.createMediaElementSource(audioElement2);
  
  var analyser = audioCtx.createAnalyser();
  var analyser2 = audioCtx2.createAnalyser();

  analyser.minDecibels = -100;
  analyser.maxDecibels = 0;
  analyser.smoothingTimeConstant = 0.8;
  //analyser.fftSize = 32768;
  analyser.fftSize = 512;
  analyser2.fftSize = 512;
  var bufferLength = analyser.frequencyBinCount;
  var bufferLength2 = analyser2.frequencyBinCount;
  var dataArray = new Float32Array(bufferLength);
  var dataArray2 = new Float32Array(bufferLength2);
  var frequency = new Array();
  var frequency2 = new Array();
  var barWidth = new Array();
  var barWidth2 = new Array();

  canvas.width = window.innerWidth * 0.98;
  canvas.height = window.innerHeight * 0.9;

  canvas2.width = window.innerWidth * 0.98;
  canvas2.height = window.innerHeight * 0.9;
   
  WIDTH = canvas.width; 
  HEIGHT = canvas.height;

  WIDTH2 = canvas2.width; 
  HEIGHT2 = canvas2.height;

  h1 = HEIGHT - 100;
  h2 = HEIGHT2 - 100;

  source.connect(analyser);
  source2.connect(analyser2);
  
  analyser.connect(audioCtx.destination);
  analyser2.connect(audioCtx2.destination);

  calculate()

  requestAnimationFrame(update); 

 function calculate(){

    for(var i = 0; i < bufferLength; i++) {
        frequency[i] = i * audioCtx.sampleRate / 512;
        frequency2[i] = i * audioCtx2.sampleRate / 512;
  
        // calculate bar width -> exponential -> logarithm
        barWidth[i] = (Math.log(i+2)-Math.log(i+1))*WIDTH/Math.log(bufferLength);
        barWidth2[i] = (Math.log(i+2)-Math.log(i+1))*WIDTH2/Math.log(bufferLength);
  
        //this.barWidth[i] = this.ANALYZERWIDTH/this.bufferLength;
      }
      // clear
      clearCanvas();
 }

 function clearCanvas(){
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx2.fillRect(0, 0, WIDTH2, HEIGHT2);
 }

 function updateFreqDataArrayToPlot() {
    analyser.getFloatFrequencyData(dataArray); 
    analyser2.getFloatFrequencyData(dataArray2); 
  }

 function drawOneLabel2(i, x, widthInBars, color) {
    let fontSize = 14;
    if(WIDTH < 600) {
      fontSize = 8;
    } 
    else if(WIDTH < 400) {
      fontSize = 4;
    }

    canvasCtx.font = fontSize + 'px Arial';
    canvasCtx.fillStyle = color;

    var sumBar=0;
    for (var l=0;l<widthInBars;l++){
      sumBar+=barWidth[i-l]+1;
    }
    //distance=-x+fontSize/2;
    //let distance=-x-widthInBars*this.barWidth[i]/2+(fontSize/2);
    var distance=-x+((fontSize-sumBar)/2);
    

    canvasCtx.save();
    
    // insert "kilo" herz
    if(frequency[i] >= 1000) {
      canvasCtx.fillText(Math.round(frequency[i+1]/100)/10+ ' kHz', HEIGHT-80,distance);
    } else {
      canvasCtx.fillText(Math.round(frequency[i+1])+ ' Hz', HEIGHT-80,distance);
    }
    // draw small scale identifyer
    canvasCtx.beginPath();
    canvasCtx.moveTo(h1,-x+1);
    canvasCtx.lineTo(h1+10,-x+1);
    canvasCtx.strokeStyle = "black";
    canvasCtx.stroke();
    canvasCtx.restore();

  }

  function drawFrequencyLabels() {
    canvasCtx.save();

    // draw bottom in dark grey
    canvasCtx.fillStyle = "#000";

    // Draw rotated freq labels
    canvasCtx.save();
  

    // draw frequency labels (rotated 90 degree to be vertically drawn)
    canvasCtx.rotate(Math.PI / 2);

    var x=0, a=0, b=0, c=0, d=0;
    for(let i = 0; i < bufferLength; i++) {
      if (i<16)
      {
        drawOneLabel2(i,x,1,"black");
      }
      else if(i<32) 
      {
        if (a%2===0) drawOneLabel2(i,x,2,"black");
        a++;
      }
      else if(i<64)
      {
        if (b%4===0) drawOneLabel2(i,x,4,"black");
        b++;
      }
      else if(i<128)
      {
        if (c%8===0) drawOneLabel2(i,x,8,"black");
        c++;
      }
      else {
        if(d%16===0) drawOneLabel2(i,x,16,"black");
        d++;
      }
      x+=barWidth[i]+1;
    }
     canvasCtx.restore();


    // draw x-scale stroke
    canvasCtx.beginPath();
    canvasCtx.moveTo(0,h1+5);
    canvasCtx.lineTo(WIDTH,h1+5); 
    canvasCtx.strokeStyle = "black";
    canvasCtx.stroke();
    
    canvasCtx.restore();
  }

 function drawLeftDbScale() {
    canvasCtx.save();
    // draw left scale
    
    let stepSize = 10;
    let steps = (analyser.maxDecibels - analyser.minDecibels)/stepSize;

    canvasCtx.fillStyle ="black";
    let fontSize = 14;
        if(HEIGHT < 250) {
      fontSize = 8;
    } else if(HEIGHT < 100) {
      fontSize = 4;
    }

    canvasCtx.font = 'normal ' + fontSize + 'px Arial';
    
    var y = analyser.maxDecibels;
    
    for(let i = 0; i < steps;i++) {
      // draw text
      canvasCtx.fillText(y + ' db', 10, h1/steps*i+30);
      // draw small scale identifier
      canvasCtx.beginPath();
      canvasCtx.moveTo(55,h1/steps*i+25);
      canvasCtx.lineTo(65,h1/steps*i+25);
      canvasCtx.strokeStyle = "black";
      canvasCtx.stroke();

      y -= stepSize;
    }
    // draw y-scale axis
    canvasCtx.beginPath();
    canvasCtx.moveTo(60,0);
    canvasCtx.lineTo(60,h1+5);
    canvasCtx.strokeStyle = "black";
    canvasCtx.stroke();

    canvasCtx.restore();
    
  }

  function drawOneLabel(i, x, widthInBars, color) {
    let fontSize = 14;
    if(WIDTH2 < 600) {
      fontSize = 8;
    } 
    else if(WIDTH2 < 400) {
      fontSize = 4;
    }

    canvasCtx2.font = fontSize + 'px Arial';
    canvasCtx2.fillStyle = color;

    var sumBar2=0;
    for (var l=0;l<widthInBars;l++){
      sumBar2+=barWidth2[i-l]+1;
    }
    //distance=-x+fontSize/2;
    //let distance=-x-widthInBars*this.barWidth[i]/2+(fontSize/2);
    var distance2=-x+((fontSize-sumBar2)/2);
    

    canvasCtx2.save();
    
    // insert "kilo" herz
    if(frequency[i] >= 1000) {
      canvasCtx2.fillText(Math.round(frequency[i+1]/100)/10+ ' kHz', HEIGHT2-80,distance2);
    } else {
      canvasCtx2.fillText(Math.round(frequency[i+1])+ ' Hz', HEIGHT2-80,distance2);
    }
    // draw small scale identifyer
    canvasCtx2.beginPath();
    canvasCtx2.moveTo(h2,-x+1);
    canvasCtx2.lineTo(h2+10,-x+1);
    canvasCtx2.strokeStyle = "#eee";
    canvasCtx2.stroke();
    canvasCtx2.restore();
  }
  
  function drawFrequencyLabels2() {
    canvasCtx2.save();
    
    // draw bottom in dark gre
    canvasCtx2.fillStyle = "#000";
    canvasCtx2.fillRect(0, h2+1, WIDTH2, HEIGHT2);

    // Draw rotated freq labels
    canvasCtx2.save();
  

    // draw frequency labels (rotated 90 degree to be vertically drawn)
    canvasCtx2.rotate(Math.PI / 2);

    var x=0, a=0, b=0, c=0, d=0;
    for(let i = 0; i < bufferLength; i++) {
      if (i<16)
      {
        drawOneLabel(i,x,1,"#eee");
      }
      else if(i<32) 
      {
        if (a%2===0) drawOneLabel(i,x,2,"#eee");
        a++;
      }
      else if(i<64)
      {
        if (b%4===0) drawOneLabel(i,x,4,"#eee");
        b++;
      }
      else if(i<128)
      {
        if (c%8===0) drawOneLabel(i,x,8,"#eee");
        c++;
      }
      else {
        if(d%16===0) drawOneLabel(i,x,16,"#eee");
        d++;
      }
      x+=barWidth2[i]+1;
    }
     canvasCtx2.restore();


    // draw x-scale stroke
    canvasCtx2.beginPath();
    canvasCtx2.moveTo(0,h2+5);
    canvasCtx2.lineTo(WIDTH2,h2+5); 
    canvasCtx2.strokeStyle = "#eee";
    canvasCtx2.stroke();
    
    canvasCtx2.restore();
  }

 function drawLeftDbScale2() {
    canvasCtx2.save();
    // draw left scale
    
    let stepSize2 = 10;
    let steps2 = (analyser.maxDecibels - analyser.minDecibels)/stepSize2;
    
    canvasCtx.fillStyle ="#eee";
    canvasCtx2.fillStyle ="#eee";
    
    let fontSize = 14;
        if(HEIGHT2 < 250) {
      fontSize = 8;
    } else if(HEIGHT2 < 100) {
      fontSize = 4;
    }

    canvasCtx2.font = 'normal ' + fontSize + 'px Arial';
   
    var y = analyser.maxDecibels;
    
    for(let i = 0; i < steps2;i++) {
      // draw text
      canvasCtx2.fillText(y + ' db', 10, h2/steps2*i+30);
      // draw small scale identifier
      canvasCtx2.beginPath();
      canvasCtx2.moveTo(55,h2/steps2*i+25);
      canvasCtx2.lineTo(65,h2/steps2*i+25);
      canvasCtx2.strokeStyle = "#eee";
      canvasCtx2.stroke();

      y -= stepSize2;
    }
    // draw y-scale axis
    canvasCtx2.beginPath();
    canvasCtx2.moveTo(60,0);
    canvasCtx2.lineTo(60,h2+5);
    canvasCtx2.strokeStyle = "#eee";
    canvasCtx2.stroke();

    canvasCtx2.restore();
    
  }


 function drawFrequencyBars() {
    canvasCtx.save();
    
    let x = 0;
    //console.log(dataArray);
    // draw bars (rectangles)
    for(let i = 0; i < bufferLength; i++) {
      let barHeight = (dataArray[i]+140)*(h1/140);
      
      barHeight /= (90 / (analyser.maxDecibels - analyser.minDecibels));
      
      if(barHeight < 0) barHeight = 0;

      // draw bar
      // this.ctx.fillStyle = 'rgb(0,'+(barHeight+50)+',0)';
      // nice blue....
      canvasCtx.fillStyle = "brown";

      // draw a bar
      canvasCtx.fillRect(x,h1-barHeight,barWidth[i],barHeight);
      x += barWidth[i] + 1;
    }
    
    canvasCtx.restore();
  }

  function drawFrequencyBars2() {
    canvasCtx2.save();
    
    let z = 0;
    //console.log(dataArray);
    // draw bars (rectangles)
    for(let i = 0; i < bufferLength2; i++) {
      let barHeight2 = (dataArray2[i]+140)*(h2/140);
      
      barHeight2 /= (90 / (analyser.maxDecibels - analyser.minDecibels));
      
      if(barHeight2 < 0) barHeight2 = 0;

      // draw bar
      // this.ctx.fillStyle = 'rgb(0,'+(barHeight+50)+',0)';
      // nice blue....
      canvasCtx2.fillStyle = "brown";

      // draw a bar
      canvasCtx2.fillRect(z,h2-barHeight2,barWidth2[i],barHeight2);
      z += barWidth2[i] + 1;
    }
    
    canvasCtx2.restore();
  }
 function drawLabel() {
    canvasCtx.save();

    let fontSize = 14;
    canvasCtx.font =  fontSize + 'px Arial';
    canvasCtx.testAlign='center';
    canvasCtx.fillStyle = "black";
    canvasCtx.fillText("", WIDTH/2-40, 30);
    canvasCtx.restore();
  }

  function drawLabel2() {
    canvasCtx2.save();

    let fontSize = 14;
    canvasCtx2.font =  fontSize + 'px Arial';
    canvasCtx2.testAlign='center';
    canvasCtx2.fillStyle = "#eee";
    canvasCtx2.fillText("", WIDTH2/2-40, 30);
    canvasCtx2.restore();
  }
 function update() {   
    clearCanvas();

    updateFreqDataArrayToPlot();
    drawFrequencyLabels();
    drawFrequencyLabels2();
    drawFrequencyBars();
    drawFrequencyBars2();
    drawLeftDbScale();
    drawLeftDbScale2();
    drawLabel();
    drawLabel2();
    // repaint 60 times/s
    requestAnimationFrame(update); 
  }
}

