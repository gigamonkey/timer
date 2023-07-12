const $ = (q) => document.querySelector(q);

let time = 0;
let timer;

const fmt = (t) => {
  const minutes = Math.floor(t / 60);
  const seconds = Math.round(t % 60);

  const mm = (minutes+'').padStart(2, '0');
  const ss = (seconds+'').padStart(2, '0');
  return `${mm}:${ss}`;
};

const countdown = () => {
  const start = Date.now();
  const end = Date.now() + time * 1000;

  const update = () => {
    const now = Date.now();
    if (now < end) {
      $('#clock').innerText = fmt(Math.round((end - now) / 1000))
      setTimeout(update, 1000);
    } else {
      $('#clock').innerText = fmt(0);
    }
  }
  update();
};

const changeTime = (fn) => {
  time = fn(time);
  $('#clock').innerText = fmt(time);

  let left = time;
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

$('#left').onclick = () => changeTime(t => t * 2);
$('#right').onclick = () => changeTime(t => t / 2);
$('#clock').onclick = countdown;
