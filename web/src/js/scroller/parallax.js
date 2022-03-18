import { smoothscroller } from "./smooth";
import {
  Ease,
  ro,
  lerp,
  select,
  bounds,
  invlerp,
  getOffsetTop,
  Sniff,
} from "../hermes";

export class Parallax {
  constructor({
    dom,
    speed = 1,
    down = false,
    scale = {
      x: { start: 0, end: 0 },
      y: { start: 0, end: 0 },
    },
    rotate = {
      x: { start: 0, end: 0 },
      y: { start: 0, end: 0 },
    },
    translate = {
      x: { start: 0, end: 0 },
      y: { start: 0, end: 0 },
    },
    offset = {
      start: 0,
      end: 0,
    },
    ease = "io1",
    limitBounds = false,
  }) {
    // if (Sniff.safari) return;

    this.dom = select(dom)[0];

    this.options = {
      speed,
      down,
      ease: Ease[ease],
      translate,
      scale,
      rotate,
      offset,
      range: (speed - 1) * 100,
      limitBounds,
    };

    this.state = {
      scroll: 0,
      bounds: { y: 0, maxRange: 0 },
      boundRange: new Float32Array(2),
      needs: {
        rotate: {
          x:
            rotate.x.start !== rotate.x.end ||
            rotate.x.start !== 0 ||
            rotate.x.end !== 0,
          y:
            rotate.y.start !== rotate.y.end ||
            rotate.y.start !== 0 ||
            rotate.y.end !== 0,
        },

        scale: {
          x:
            scale.y.start !== scale.y.end ||
            scale.y.start !== 0 ||
            scale.y.end !== 0,
          y:
            scale.y.start !== scale.y.end ||
            scale.y.start !== 0 ||
            scale.y.end !== 0,
        },

        translate: {
          x:
            translate.x.start !== translate.x.end ||
            translate.x.start !== 0 ||
            translate.x.end !== 0,
          y:
            translate.y.start !== translate.y.end ||
            translate.y.start !== 0 ||
            translate.y.end !== 0,
        },
      },
    };

    this.resize();
    this.init();
  }

  init = () => {
    this.scrollID = smoothscroller.add({ update: this.onScroll });
    this.roID = ro.add({ update: this.resize });

    this.placeInit();
  };

  placeInit = () => {
    this.dom.style.transform = `translateY(${this.options.down ? 100 : 0}%)`;
  };

  onScroll = ({ y }) => {
    this.state.scroll = -y;
    this.update();
  };

  update = () => {
    const { scroll, boundRange, needs } = this.state;
    if (scroll > boundRange[0] && scroll < boundRange[1]) {
      let x = 0,
        r = 0;

      const progress = invlerp(boundRange[0], boundRange[1], scroll);
      const y = this.options.ease(this.options.down ? 1 - progress : progress); // 0 -> 1

      let ypx;
      if (this.options.limitBounds) {
        ypx = lerp(0, this.state.bounds.maxRange, y);
      } else {
        ypx = y * this.state.bounds.y;
      }
      this.dom.style.transform = `translate3d(${x}${
        x ? "%" : ""
      }, ${ypx}px, 0) ${r ? `rotate(${r}deg)` : ""}`;
    }
  };

  resize = () => {
    const offsetTop = getOffsetTop(this.dom);
    const { height } = bounds(this.dom);

    const bottom = offsetTop + height;

    if (this.options.limitBounds) {
      const parentRect = bounds(this.dom.parentNode);
      this.state.bounds.maxRange =
        parentRect.height - height - this.dom.offsetTop / 2; // hack /2 to increase rangez
    }

    this.state.bounds.y = height;

    this.state.boundRange[0] =
      offsetTop -
      this.options.range -
      window.innerHeight +
      this.options.offset.start -
      height;

    this.state.boundRange[1] =
      bottom + this.options.range + this.options.offset.end + height;

    this.update();
  };

  destroy = () => {
    if (Sniff.safari) return;

    smoothscroller.remove(this.scrollID);
    ro.remove(this.roID);
  };
}
