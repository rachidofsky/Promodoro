$('document').ready(function() {
  var start = false;
  var setTimeoutTimer;
  var audioContext = new AudioContext;

  initiateCanvas();
  bindBtnFn();
  clockClick();

  $("#textBreak").prop('disabled', true);
  $("#textSession").prop('disabled', true);

  $('#domClk').click(function(){
    clockClick();
  });
  
  
  function clockClick() {
    start = !start;

    if (start == true) {
      $('button').animate({
        opacity: "0"
      });
      $('button').unbind();
    } else {
      bindBtnFn();
    }
    
    callTimer();
  }

  function callTimer() {
    var clock = $('#clockNumber').html();
    var min = +clock.slice(0, 2);
    var sec = +clock.slice(3);
    var currentText = $('.textCurrent').html();
    var nextText = currentText == "Session" ? "Break" : "Session";
    if (start && min < 100) {
      setTimeoutTimer = setTimeout(function() {
        sec = sec + 1;
        min = min + Math.floor(sec / 60);
        sec = sec % 60;
        sec = makeTwoDigit(sec);
        min = makeTwoDigit(min);

        if ((min + ':' + sec) == $('#text' + currentText).val() + ':00') {
          playSound();
          $('#domClk').css('opacity', '1');
          $('#domClk').removeClass('fadeDown showUp');
          clearTimeout(setTimeoutTimer);
          $('#domClk').addClass('fadeDown').fadeTo(1000, 0, function() {
            $('#clockNumber').html("00:00");
            $('.textCurrent').html(nextText);
            $('#domClk').addClass('showUp');
            drawCircle(min * 60 + (+sec), $('#text' + currentText).val() * 60,
              currentText == 'Session' ? '#FFF' : '#D62020');
            callTimer();
          });
        } else {
          $('#clockNumber').html(min + ':' + sec);
          drawCircle(min * 60 + (+sec), $('#text' + currentText).val() * 60,
            currentText == 'Session' ? '#FFF' : '#D62020');
          callTimer();
        }
      }, 1000);
    } else {
      clearTimeout(setTimeoutTimer);
    }
  }

  function playSound() {
    var oscillator = audioContext.createOscillator();
    oscillator.frequency = 500;
    var gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    var now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  function drawCircle(val, total, color) {
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initiateCanvas();

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.8;
    val = (-0.5 * Math.PI) + (val * (2 * Math.PI) / total);
    ctx.arc(105, 105, 100, -0.5 * Math.PI, val);
    ctx.stroke();
  }

  function initiateCanvas() {
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.strokeStyle = "#FFF";
    ctx.arc(105, 105, 100, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
  }

  function bindBtnFn() {
    $('button').animate({
      opacity: "1"
    });
    $('#plusBreak').click(function() {
      var val = +$('#textBreak').val();
      val = val + 1;
      $('#textBreak').val(makeTwoDigit(val));
      resetClock()
    })
    $('#plusSession').click(function() {
      var val = +$('#textSession').val();
      val = val + 1;
      $('#textSession').val(makeTwoDigit(val));
      resetClock()
    })
    $('#minusBreak').click(function() {
      var val = +$('#textBreak').val();
      val = val - 1;
      if (val == 0) {
        return 0;
      }
      $('#textBreak').val(makeTwoDigit(val));
      resetClock()
    })
    $('#minusSession').click(function() {
      var val = +$('#textSession').val();
      val = val - 1;
      if (val == 0) {
        return 0;
      }
      $('#textSession').val(makeTwoDigit(val));
      resetClock()
    })
  }
  
  function makeTwoDigit(val){
    val = val < 10 ? '0' + val : val;
    return val;
  }

  function resetClock() {
    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initiateCanvas();
    $('#clockNumber').html('00:00');
  }
});
