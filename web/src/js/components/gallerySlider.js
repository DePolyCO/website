import {
  bounds,
  iris,
  LerpController,
  qs,
  ticker,
  ro,
  getOffsetTop,
  Sniff,
  Observer,
  Tween,
} from "../hermes";
import { Slider } from "./slider";
import { smoothscroller } from "../scroller";

export class GallerySlider {
  constructor() {
    this.dom = qs("#meet-slider");
    this.slider = new Slider({ container: this.dom });
    this.handle = qs("#meet-slider--handle", this.dom);

    if (Sniff.touchDevice) {
      iris.add(
        this.dom,
        iris.events.down,
        () => {
          this.handle.style.opacity = 0;
          this.handle.style.pointerEvents = "none";
        },
        {
          once: true,
        }
      );
      return;
    }

    this.state = {
      pos: {
        x: { cur: 0, target: 0, inertia: 0.075 },
        y: { cur: 0, target: 0, inertia: 0.075 },
      },
      bounds: {
        x: 0,
        y: 0,
      },
      containerBounds: {
        x: 0,
        y: 0,
      },
      scroll: 0,
    };

    this.lerp = {
      x: new LerpController(this.state.pos.x),
      y: new LerpController(this.state.pos.y),
    };

    this.resize();
    this.listen();
    this.init();
  }

  init = () => {
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });

    const { containerBounds, pos } = this.state;

    pos.x.cur = containerBounds.x * 2;
    pos.y.cur = containerBounds.y + containerBounds.height / 2;

    if (Sniff.touchDevice) return;

    this.observer = Observer.create({
      callback: this.visible,
    });
    this.observer.observe(this.dom);
  };

  listen = () => {
    const { move } = iris.events;
    this.unMove = iris.add(this.dom, move, this.handleMove);
  };

  visible = (node, isIntersecting) => {
    if (!isIntersecting) return;
    this.observer.disconnect();
    const pos = this.slider.state.pos;
    this.slider.state.locked = true;
    Tween({
      val: [-ro.bounds.vw, 0],
      duration: 2000,
      easing: "o6",
      update: ({ cur }) => {
        pos.cx = cur;
      },
      complete: () => {
        this.slider.state.locked = false;
      },
    });

    Tween({
      val: [2 * ro.bounds.vw, this.state.pos.x.cur],
      duration: 2000,
      easing: "o6",
      update: ({ cur }) => {
        this.state.pos.x.cur = cur;
      },
    });
  };

  handleMove = (e) => {
    const { pos } = this.state;
    const { x, y } = iris.getXY(e);

    pos.x.cur = x;
    pos.y.cur = y - smoothscroller.state.scroll.y.target;
  };

  update = () => {
    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    this.render();
  };

  render = () => {
    const { pos, containerBounds } = this.state;
    const { x, y } = pos;

    this.handle.style.transform = `translate3d(${
      x.target - containerBounds.x
    }px, ${y.target - containerBounds.y}px, 0)`;
  };

  resize = () => {
    const { left, top, height, width } = bounds(this.handle);
    this.state.bounds.x = left + width / 2;
    this.state.bounds.y = top + height;

    const containerBounds = bounds(this.dom);
    this.state.containerBounds.x = containerBounds.x + width / 2;
    this.state.containerBounds.y = getOffsetTop(this.dom) + height;
    this.state.containerBounds.height = containerBounds.height;
  };

  destroy() {
    if (Sniff.touchDevice) return;

    ticker.remove(this.tickID);
    ro.remove(this.roID);

    this.unMove();
  }
}
