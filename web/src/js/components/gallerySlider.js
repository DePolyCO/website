import { bounds, iris, LerpController, qs, ticker, clamp, ro } from "../hermes";
import { Slider } from "./slider";

export class Gallery {
  constructor() {
    this.dom = qs("#meet-slider");
    this.slider = new Slider({ container: this.dom });
    this.handle = qs("#meet-slider--handle", this.dom);

    this.state = {
      bounds: {
        x: 0,
        y: 0,
      },
      handleBounds: {
        x: 0,
        y: 0,
      },
      pos: {
        x: { cur: 0, target: 0, inertia: 0.075 },
        y: { cur: 0, target: 0, inertia: 0.075 },
      },
      drag: {
        isDragging: false,
        start: {
          x: 0,
          y: 0,
        },
        last: {
          x: 0,
          y: 0,
        },
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
    this.roID = ro.add({ update: this.resize });
  };

  listen = () => {
    const { move } = iris.events;
    this.unMove = iris.add(this.dom, move, this.handleMove);
  };

  clampY = (y) => {
    return clamp(y, 0, this.state.bounds.y);
  };

  clampX = (x) => {
    return clamp(x, 0, this.state.bounds.x);
  };

  handleMove = (e) => {
    const { pos } = this.state;

    const { x, y } = iris.getXY(e);

    pos.x.cur = x;
    pos.y.cur = y;
  };

  handleDown = (e) => {
    this.state.isDown = true;
  };

  handleUp = (e) => {
    this.state.isDown = false;
  };

  update = () => {
    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    this.render();
  };

  render = () => {
    const { x, y } = this.state.pos;

    this.handle.style.transform = `translate3d(${x.target}px, ${y.target}px, 0)`;
  };

  resize = () => {
    const { handleBounds, pos } = this.state;
    const { height, width } = bounds(this.dom);
    const handleRect = bounds(this.handle);

    handleBounds.x = handleRect.width / 2;
    handleBounds.y = handleRect.height;

    pos.x.cur = this.clampX((pos.x.cur / this.state.bounds.x) * width);
    pos.y.cur = this.clampY(
      (pos.y.cur / this.state.bounds.y) * height - handleRect.height
    );

    this.state.bounds.x = width;
    this.state.bounds.y = height - handleRect.height;
  };

  destroy() {
    ticker.remove(this.tickID);
    ro.remove(this.roID);
    this.undown && this.undown();
    this.unmove && this.unmove();
    this.unup && this.unup();
  }
}
