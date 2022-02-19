import { scroller } from "./index";
import { bindAll, select, lerp, ro } from "../hermes";

export class Parallax {
  constructor({
    dom,
    speed = 1.5,
    down = false,
    scale = 1.5,
    rotate = {
      start: 0,
      end: 0,
    },
    offset = {
      start: 0,
      end: 0,
    },
    offsetX = 0,
  }) {
    this.dom = select(dom)[0];
    this.id = this.dom.dataset.scrollWatch;
    this.speed = speed;

    this.offset = offset;
    this.offsetX = offsetX;
    this.scale = scale;
    this.rotate = rotate;

    this.down = down ? -1 : 1;
    this.range = (speed - 1) * 100;
    this.current = 0;
    this.currentRotate = 0;

    this.needsRotate =
      this.rotate.start !== this.rotate.end ||
      this.rotate.start !== 0 ||
      this.rotate.end !== 0;

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
      if (el.visible && el.container === this.id) {
        this.current = lerp(
          -this.range + this.offset.start,
          this.range + this.offset.end,
          el.progress
        );

        if (this.needsRotate) {
          this.currentRotate = lerp(
            this.rotate.start,
            this.rotate.end,
            el.progress
          );
        }

        this.render();
        break;
      }
    }
  }

  render() {
    this.dom.style.transform = `scale(${this.scale}) translate3d(${
      this.offsetX
    }%, ${this.current * this.down}%, 0) rotate(${this.currentRotate}deg)`;
  }

  destroy() {
    scroller.remove(this.scrollid);
    ro.remove(this.rsize);
  }
}
