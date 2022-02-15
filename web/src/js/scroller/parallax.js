import { scroller } from "./index";
import { bindAll, select, lerp, ro } from "../hermes";

export class Parallax {
  constructor({ dom, speed = 1.5, down = false }) {
    this.dom = select(dom)[0];
    this.speed = speed;
    this.down = down ? -1 : 1;
    this.range = (speed - 1) * 100;
    this.current = 0;

    bindAll(this, ["update", "resize"]);

    this.scrollid = scroller.add({ update: this.update });
    this.rsize = ro.add({
      update: this.resize,
    });

    this.resize();
  }

  resize() {
    this.render();
    this.update(scroller.state, scroller.cache);
  }

  update(state, cache = []) {
    for (let i = 0, n = cache.length; i < n; i++) {
      const el = cache[i];
      if (el.visible && el.track === this.dom.id) {
        this.current = lerp(-this.range, this.range, el.progress);
        this.render();
        break;
      }
    }
  }

  render() {
    this.dom.style.transform = `scale(${this.speed}) translateY(${
      this.current * this.down
    }%)`;
  }

  destroy() {
    scroller.remove(this.scrollid);
    ro.remove(this.rsize);
  }
}
