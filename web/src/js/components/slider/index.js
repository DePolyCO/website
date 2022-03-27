import {
  qs,
  qsa,
  select,
  bounds,
  ticker,
  ro,
  bindAll,
  iris,
  clamp,
  lerp,
  round,
  Sniff,
  damp,
} from "../../hermes";
import { smoothscroller } from "../../scroller";

//
// Slider
// =======
// Todo:
// + Implement generic logic class
// + Clean up state
//
export class Slider {
  constructor({
    container = ".carousel-container",
    slider = ".carousel-slider",
    slides = ".carousel-slide",
    inertia = 0.1,
    dragSpeed = 1.5,
  } = {}) {
    this.container = select(container)[0];
    this.slider = qs(slider, this.container);

    this.slides = qsa(slides, this.slider).map((dom, i) => ({
      dom,
      visible: true,
      x: 0,
    }));

    Object.assign(this, {
      inertia: Math.log(1 - inertia / 15),
      dragSpeed,
    });

    this.state = {
      pos: {
        sx: 0, // start
        cx: 0, // current
        tx: 0, // target
        lx: 0, // last
      },
      rects: {
        max: 0,
        min: 0,
        slideWidth: 0,
        sliderWidth: 0,
        containerWidth: 0,
      },
      dragging: false,
      direction: 1, // +ve is right
      locked: false,
    };

    this.resize();
    this.listeners();
    this.init();

    if (Sniff.touchDevice) return;
    this.state.pos.cx = -window.innerWidth;
  }

  init = () => {
    this.roID = ro.add({ update: this.resize });
    this.tickID = ticker.add({ update: this.update });
  };

  clamp = (val = 0) => {
    const { min, max } = this.state.rects;
    return clamp(val, min, max);
  };

  listeners = () => {
    const { move, up, down } = iris.events;

    this.removeDown = iris.add(this.container, down, this.handleDown);
    this.removeWheel = iris.add(this.container, `wheel`, this.handleWheel);
    this.removeMove = iris.add(window, move, this.handleMove);
    this.removeUp = iris.add(window, up, this.handleUp);
  };

  handleDown = (e) => {
    const { pos, locked } = this.state;
    if (locked) return;

    this.container.classList.add("active");
    this.state.dragging = true;

    pos.sx = iris.getXY(e).x;
    pos.lx = pos.tx;

    smoothscroller.lock("carousel");
  };

  handleWheel = (e) => {
    const { pos, locked } = this.state;
    if (locked) return;
    const delta = e.deltaX;

    this.state.direction = delta > 0 ? 1 : -1;

    pos.cx += delta * this.dragSpeed;
    pos.cx = this.clamp(pos.cx);
  };

  handleMove = (e) => {
    const { pos, locked } = this.state;
    if (locked) return;
    if (!this.state.dragging) return;

    const delta = pos.sx - iris.getXY(e).x;
    this.state.direction = delta > 0 ? 1 : -1;

    pos.cx = pos.lx + delta * this.dragSpeed;
    pos.cx = this.clamp(pos.cx);
  };

  handleUp = () => {
    this.state.dragging = false;
    smoothscroller.unlock("carousel");
    this.container.classList.remove("active");
  };

  resize = (o = { vw: window.innerWidth, vh: window.innerHeight }) => {
    this.bounds = o;
    const { rects } = this.state;

    rects.slideWidth = this.slides[0].dom.offsetWidth;
    rects.sliderWidth = this.slider.offsetWidth;
    rects.containerWidth = this.container.offsetWidth;

    rects.max = bounds(this.slider).width - rects.containerWidth;
  };

  get shouldAnimate() {
    const { tx, cx } = this.state.pos;
    return Math.abs(tx - cx) > 0.01;
  }

  update = (t, ct) => {
    if (!this.shouldAnimate) return;
    const { pos } = this.state;

    pos.tx = damp(pos.tx, pos.cx, this.inertia, ticker.delta);

    this.slider.style.transform = `translate3d(${round(-pos.tx)}px, 0, 0)`;
  };

  destroy = () => {
    this.removeDown();
    this.removeUp();
    this.removeMove();
    this.removeWheel();

    smoothscroller.unlock("carousel");
    ticker.remove(this.tickID);
    ro.remove(this.roID);
  };
}
