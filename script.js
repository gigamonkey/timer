const $ = (q) => document.querySelector(q);

let time = 0;

const fmt = (t) => {
  const minutes = Math.floor(t / 60);
  const seconds = Math.round(t % 60);

  const mm = (minutes+'').padStart(2, '0');
  const ss = (seconds+'').padStart(2, '0');
  return `${mm}:${ss}`;
};

const makeClicker = (b, amt) => {
  return (e) => {
    if (b.classList.contains('selected')) {
      b.classList.remove('selected');
      time -= amt;
    } else {
      b.classList.add('selected');
      time += amt
    }
    $('#clock').innerText = fmt(time);
  };
}

for (let i = 0; i < 6; i++) {
  const b = document.createElement('button');
  b.onclick = makeClicker(b, 2 ** i * 60);
  $('#buttons').prepend(b)
}
$('#buttons').append(document.createTextNode(':'));
for (let i = 0; i < 6; i++) {
  const b = document.createElement('button');
  b.onclick = makeClicker(b, 2 ** (-1 - i) * 60);
  $('#buttons').append(b)
}
