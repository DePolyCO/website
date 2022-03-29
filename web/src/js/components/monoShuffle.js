import { Duration, map, Observer, qsa } from "../hermes";

class MonoShuffle {
  constructor() {
    this.common();
  }

  common = () => {
    this.chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=[];',./<>?";
    this.charsL = this.chars.length - 1;
    this.o = Observer().create({
      callback: this.reveal,
      threshold: 0,
    });
  };

  init = () => {
    this.targets = qsa("[data-shuffle]");
    this.o.observe(this.targets);

    this.targets.forEach((n) => this.prepare(n));
  };

  prepare = (node) => {
    const txt = node.innerText;
    node.dataset.text = txt;
    node.innerHTML = "";
  };

  reveal = (node, isIntersecting, unobserve) => {
    if (isIntersecting) {
      const finalValue = node.dataset.text;
      const textL = finalValue.length;
      let idx = 0,
        curIdx = -1,
        curText = "";
      const duration = textL * 100;

      new Duration({
        duration,
        update: ({ progress }) => {
          if (curText === finalValue) return;

          if (progress < 0.5) {
            // random phase
            idx = Math.floor(map(progress, 0, 0.5, 0, textL));
            const r = this.getRandomStr(idx);
            curText = r;
            node.innerText = r;
          } else {
            // correct phase
            idx = Math.floor(map(progress, 0.5, 1, 0, textL));
            if (idx === curIdx) return;
            curIdx = idx;
            const r =
              finalValue.slice(0, idx) + this.getRandomStr(textL).slice(idx);
            curText = r;
            node.innerText = r;
          }
        },
      });

      unobserve(node);
    }
  };

  getRandomChar = () => {
    return this.chars[Math.floor(Math.random() * this.charsL)];
  };

  getRandomStr = (len) => {
    let s = "";
    for (let i = 0; i < len; i++) {
      s += this.getRandomChar();
    }
    return s;
  };

  destroy = () => {
    this.o.disconnect();
  };
}

export const monoShuffle = new MonoShuffle();
