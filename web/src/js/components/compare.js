import {
  bounds,
  iris,
  LerpController,
  qs,
  select,
  ticker,
  ro,
  clamp,
  Observer,
} from "../hermes";
import { smoothscroller } from "../scroller";

export class Compare {
  constructor({ dom = "[data-compare-slider]" } = {}) {
    this.dom = select(dom)[0];
    this.clip = qs("[data-clip]", this.dom);
    this.line = qs(".compare-slider--line", this.dom);
    this.handle = qs(".compare-slider--handle", this.dom);
    this.observer = Observer().create({
      callback: this.observerChange,
    });

    this.state = {
      locked: false,
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
    this.initStyle();

    this.observer.observe(this.dom);
  }

  init = () => {
    this.tickID = ticker.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });

    this.listen();
  };

  initStyle = () => {
    this.state.pos.x.cur = this.state.bounds.x / 2;
    this.state.pos.y.cur =
      this.state.bounds.y / 2 + this.state.handleBounds.y / 2;
  };

  clampY = (y) => {
    return clamp(y, 0, this.state.bounds.y);
  };

  clampX = (x) => {
    return clamp(x, 0, this.state.bounds.x);
  };

  getXY = (e) => {
    return {
      x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
      y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY,
    };
  };

  listen = () => {
    this.undown = iris.add(this.handle, "pointerdown", this.handleDown);
    this.unmove = iris.add(window, "pointermove", this.handleMove);
    this.unup = iris.add(window, "pointerup", this.handleUp);
  };

  handleDown = (e) => {
    smoothscroller.lock("slider");

    const { drag, pos } = this.state;

    drag.isDragging = true;
    drag.start = this.getXY(e);

    // copy
    drag.last.x = pos.x.cur;
    drag.last.y = pos.y.cur;

    this.handle.classList.add("active");
  };

  handleMove = (e) => {
    const { drag, pos } = this.state;

    if (!drag.isDragging) return;

    const { x, y } = this.getXY(e);
    const diffX = x - drag.start.x;
    const diffY = y - drag.start.y;

    pos.x.cur = this.clampX(drag.last.x + diffX);
    pos.y.cur = this.clampY(drag.last.y + diffY);
  };

  handleUp = () => {
    this.state.drag.isDragging = false;
    this.handle.classList.remove("active");
    smoothscroller.unlock("slider");
  };

  update = () => {
    if (!this.lerp.x.needsUpdate() && !this.lerp.y.needsUpdate()) return;

    this.lerp.x.update();
    this.lerp.y.update();

    this.render();
  };

  render = () => {
    const { pos, bounds, handleBounds } = this.state;

    this.line.style.transform = `translateX(${pos.x.target}px)`;
    this.handle.style.transform = `translate3d(-${handleBounds.x}px, ${pos.y.target}px, 0)`;
    this.clip.style.clipPath = `inset(0 0 0 ${
      (pos.x.target / bounds.x) * 100
    }%)`;
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

  observerChange = (node, isIntersecting, unobserve) => {
    if (isIntersecting) {
      this.init();
    } else {
      this.destroy();
    }
  };
}
