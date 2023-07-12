const $ = (q) => document.querySelector(q);

let TICK = (1000 * 60) / 64;

let time = 0;
let timer;

const fmt = (t) => {
  const minutes = Math.floor(t / 64);
  const seconds = Math.round(t % 64);

  const mm = (minutes+'').padStart(2, '0');
  const ss = (seconds+'').padStart(2, '0');
  return `${mm}:${ss}`;
};

const countdown = () => {
  const start = Date.now();
  const end = Date.now() + time * TICK;

  const update = () => {
    const now = Date.now();
    let seconds = 0;
    if (now < end) {
      seconds = Math.round((end - now) / TICK);
      setTimeout(update, TICK);
    }
    if (seconds === 0) {
      playBeep();
    }
    $('#clock').innerText = fmt(seconds)
    updateButtonDisplay(seconds);
  }
  update();
};

const changeTime = (fn) => {
  time = fn(time);
  $('#clock').innerText = fmt(time);
  updateButtonDisplay(time);
}

const updateButtonDisplay = (t) => {
  let left = t;
  $('#buttons').querySelectorAll('button').forEach(b => {
    const s = Number(b.dataset.seconds);
    if (s <= left) {
      b.classList.add('selected');
      left -= s;
    } else {
      b.classList.remove('selected');
    }
  });
}

const buttonHandler = (e) => {
  if (e.target.classList.contains('selected')) {
    changeTime(t => t - Number(e.target.dataset.seconds));
  } else {
    changeTime(t => t + Number(e.target.dataset.seconds));
  }
};

for (let i = 0; i < 12; i++) {
  const b = document.createElement('button');
  b.dataset.seconds = 2 ** i;
  b.onclick = buttonHandler;
  if (Number(b.dataset.seconds) === 64) {
    $('#buttons').prepend(document.createTextNode(':'));
  }
  $('#buttons').prepend(b);
}

/*
for (let i = 0; i < 6; i++) {
  const b = document.createElement('button');
  b.dataset.seconds = 2 ** i * 60;
  b.onclick = buttonHandler;
  $('#buttons').prepend(b)
}

$('#buttons').append(document.createTextNode(':'));

for (let i = 0; i < 2; i++) {
  const b = document.createElement('button');
  b.dataset.seconds = 2 ** (-1 - i) * 60;
  b.onclick = buttonHandler;
  $('#buttons').append(b)
  }
*/

$('#left').onclick = () => changeTime(t => t * 2);
$('#right').onclick = () => changeTime(t => t / 2);
$('#clock').onclick = countdown;


const playBeep = () => {
  let context = new (window.AudioContext || window.webkitAudioContext)();
  let osc = context.createOscillator(); // an Oscillator is a source node that generates a periodic waveform
  osc.type = 'sine'; // type of waveform
  osc.frequency.value = 440; // frequency. You can experiment with the value
  osc.connect(context.destination); // connect oscillator to the speakers
  osc.start();
  osc.stop(10);
}
