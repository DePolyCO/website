import { Duration, map, Observer, qsa, Tween } from "../hermes";

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
      threshold: 1,
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
          idx = Math.floor(map(progress, 0, 1, 0, textL));
          if (curText === finalValue) return;
          if (curIdx === idx) {
            //   change letter
            node.innerText = curText + this.getRandomChar();
            // for (let i = 0; i <= idx; i++) {
            //   const element = array[i];
            // }
          } else {
            //   add letter
            curText += finalValue[idx];
            curIdx = idx;
            node.innerText = curText;
          }
        },
      });
      unobserve(node);
    }
  };

  getRandomChar = () => {
    return this.chars[Math.floor(Math.random() * this.charsL)];
  };

  destroy = () => {
    this.o.disconnect();
  };
}

export const monoShuffle = new MonoShuffle();
