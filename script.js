const $ = (q) => document.querySelector(q);

let TICK = (1000 * 60) / 64;

let MAX_TIME = 0xfff; // 2^12 - 1 bits of TICKs = 63:63 max value.
let time = 0;
let timer;

const fmt = (t) => {
  const minutes = Math.floor(t / 64);
  const seconds = Math.round(t % 64);

  const mm = (minutes + "").padStart(2, "0");
  const ss = (seconds + "").padStart(2, "0");
  return `${mm}:${ss}`;
};

const start = () => {
  if (!timer) {
    playBeep(110, 0.25);
    const start = Date.now();
    const end = Date.now() + time * TICK;
    $("#left").style.display = "none";
    $("#right").style.display = "none";
    $("#clock").classList.add("active");
    $("#start").classList.add("active");
    $("#pause").classList.remove("active");

    const update = () => {
      const now = Date.now();
      if (now < end) {
        time = Math.round((end - now) / TICK);
        displayTime(time);
      } else {
        stop();
        playBeep(440, 0.75);
      }
    };
    timer = setInterval(update, TICK);
  }
};

const stop = () => {
  clearInterval(timer);
  timer = undefined;
  $("#left").style.display = "inline";
  $("#right").style.display = "inline";
  $("#clock").classList.remove("active");
  $("#start").classList.remove("active");
  $("#pause").classList.remove("active");
  time = 0;
  displayTime(0);
};

const pause = () => {
  if (timer) {
    $("#start").classList.remove("active");
    $("#pause").classList.add("active");
    clearInterval(timer);
    timer = undefined;
  } else if ($("#pause").classList.contains("active")) {
    start();
  }
};

const changeTime = (fn) => {
  time = fn(time) & MAX_TIME;
  displayTime(time);
};

const displayTime = (seconds) => {
  $("#clock").innerText = fmt(seconds);
  if (seconds > 0) {
    $("#clock").classList.add("active");
  }
  updateButtonDisplay(seconds);
};

const updateButtonDisplay = (t) => {
  let left = t;
  $("#buttons")
    .querySelectorAll("button")
    .forEach((b) => {
      const s = Number(b.dataset.seconds);
      if (s <= left) {
        b.classList.add("selected");
        left -= s;
      } else {
        b.classList.remove("selected");
      }
    });
};

const buttonHandler = (e) => {
  if (!timer) {
    if (e.target.classList.contains("selected")) {
      changeTime((t) => t - Number(e.target.dataset.seconds));
    } else {
      changeTime((t) => t + Number(e.target.dataset.seconds));
    }
  }
};

for (let i = 0; i < 12; i++) {
  const b = document.createElement("button");
  b.dataset.seconds = 2 ** i;
  b.onclick = buttonHandler;
  if (Number(b.dataset.seconds) === 64) {
    $("#buttons").prepend(document.createTextNode(":"));
  }
  $("#buttons").prepend(b);
}

$("#left").onclick = () => changeTime((t) => t * 2);
$("#right").onclick = () => changeTime((t) => t / 2);
$("#clock").onclick = start;
$("#start").onclick = start;
$("#stop").onclick = stop;
$("#pause").onclick = pause;

document.body.onclick = () => {
  if (document.fullscreenElement === null) {
    document.body.requestFullscreen();
  }
};

const playBeep = (freq, duration) => {
  let context = new (window.AudioContext || window.webkitAudioContext)();
  let osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + duration);
};
