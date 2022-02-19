import {
  Sniff,
  bindAll,
  iris,
  ticker,
  ro,
  Conductor,
  bounds,
  clamp,
  qs,
} from "../hermes";

class Scroller extends Conductor {
  constructor() {
    super();

    this.scrollContent = qs(`[data-scroll-content]`);
    this.state = this.getScroll();
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;

    bindAll(this, ["update", "resize", "lock", "unlock"]);

    this.resize();
    this.listen();

    this.locked = false;

    ticker.add({ update: this.update });
    ro.add({ update: this.resize });
  }

  getScroll() {
    return { x: window.pageXOffset, y: window.pageYOffset };
  }

  setScroll({ x = this.state.x, y = this.state.y } = {}) {
    if (this.locked) return;
    this.state.y = clamp(y, 0, this.scrollHeight);
    this.state.x = 0;
  }

  listen() {
    this.wheel();
    this.key();
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  wheel() {
    iris.add(window, "wheel", (e) => {
      let x = e.deltaX;
      let y = e.deltaY;
      if (Sniff.firefox && e.deltaMode === 1) {
        x *= 60;
        y *= 60;
      }
      this.setScroll({ x: this.state.x + x, y: this.state.y + y });
    });
  }

  key() {
    iris.add(document, "keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          this.setScroll({ y: this.state.y + 100 });
          break;

        case "ArrowUp":
          this.setScroll({ y: this.state.y - 100 });
          break;

        case "PageDown":
          this.setScroll({ y: this.state.y + this.vh });
          break;

        case "PageUp":
          this.setScroll({ y: this.state.y - this.vh });
          break;

        case " ":
          if (e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA")
            return;
          this.setScroll({
            y: this.state.y + (this.vh - 40) * (e.shiftKey ? -1 : 1),
          });
      }
    });
  }

  resize({ vw, vh } = { vw: window.innerWidth, vh: window.innerHeight }) {
    this.vh = vh;
    this.vw = vw;
    this.scrollHeight = Math.max(bounds(this.scrollContent).height, vh) - vh;
    this.setScroll();
  }

  update() {
    for (let i = 0, n = this.train.length; i < n; i++) {
      this.train[i].update(this.state);
    }
  }
}

export const corescroller = new Scroller();
// window.core = corescroller;
