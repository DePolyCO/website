import { bounds, iris, LerpController, qs, ticker, clamp, ro } from "../hermes";
import { Slider } from "./slider";
import { smoothscroller } from "../scroller";

export class GallerySlider {
  constructor() {
    this.dom = qs("#meet-slider");
    this.slider = new Slider({ container: this.dom });
    this.handle = qs("#meet-slider--handle", this.dom);

    this.state = {
      pos: {
        x: { cur: 0, target: 0, inertia: 0.075 },
        y: { cur: 0, target: 0, inertia: 0.075 },
      },
      bounds: {
        x: 0,
        y: 0,
      },
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
    // this.roID = ro.add({ update: this.resize });
  };

  listen = () => {
    const { move } = iris.events;
    this.unMove = iris.add(this.dom, move, this.handleMove);
  };

  handleMove = (e) => {
    const { pos } = this.state;

    const { x, y } = iris.getXY(e);

    pos.x.cur = x;
    pos.y.cur = y;
  };

  update = () => {
    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    this.render();
  };

  render = () => {
    const { pos, bounds } = this.state;
    const { x, y } = pos;

    this.handle.style.transform = `translate3d(${x.target - bounds.x}px, ${
      y.target - bounds.y - smoothscroller.state.scroll.y.target
    }px, 0)`;
  };

  resize = () => {
    const { left, top, height, width } = bounds(this.handle);
    this.state.bounds.x = left + width / 2;
    this.state.bounds.y = top + height;
  };

  destroy() {
    ticker.remove(this.tickID);
    ro.remove(this.roID);

    this.unMove();
  }
}
