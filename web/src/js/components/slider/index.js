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
      inertia,
      dragSpeed,
    });

    this.state = {
      dragging: false,
      sx: 0, // start
      cx: 0, // current
      tx: 0, // target
      lx: 0, // last
      fx: 0, // final
      max: 0,
      min: 0,
      direction: 1, // +ve is right
      slideWidth: 0,
      sliderWidth: 0,
      containerWidth: 0,
      threshold: 0,
      progress: 0,
    };

    this.resize();
    this.detect();
    this.listeners();

    this.roID = ro.add({
      update: this.resize,
    });

    this.tickID = ticker.add({
      update: this.update,
    });
  }

  detect = () => {
    let type = "pointer";
    let down = "down";
    let up = "up";

    if (Sniff.touchDevice) {
      type = "touch";
      down = "start";
      up = "end";
    }

    this.events = {
      type,
      up,
      down,
    };
  };

  clamp = (val = 0) => {
    return clamp(val, this.state.min, this.state.max);
  };

  // TODO:
  // + Return the appropriate function, instead of checking each time.
  // + Do this in Iris?
  getXY = (e) => {
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    return { x, y };
  };

  listeners = () => {
    let { type, up, down } = this.events;
    let state = this.state;

    this.removeDown = iris.add(this.container, `${type}${down}`, (e) => {
      this.container.classList.add("active");
      state.dragging = true;
      state.sx = this.getXY(e).x;
      state.lx = state.tx;
      smoothscroller.lock("carousel");
    });

    this.removeWheel = iris.add(this.container, `wheel`, (e) => {
      let delta = e.deltaX;
      state.direction = delta > 0 ? 1 : -1;
      state.cx += delta * this.dragSpeed;
      state.cx = this.clamp(state.cx);
    });

    this.removeMove = iris.add(window, `${type}move`, (e) => {
      if (!state.dragging) return;
      let delta = state.sx - this.getXY(e).x;
      state.direction = delta > 0 ? 1 : -1;
      state.cx = state.lx + delta * this.dragSpeed;
      state.cx = this.clamp(state.cx);
    });

    this.removeUp = iris.add(window, `${type}${up}`, (e) => {
      state.dragging = false;
      smoothscroller.unlock("carousel");
      this.container.classList.remove("active");
    });
  };

  resize = (o = { vw: window.innerWidth, vh: window.innerHeight }) => {
    this.bounds = o;
    let state = this.state;

    state.slideWidth = this.slides[0].dom.offsetWidth;
    state.sliderWidth = this.slider.offsetWidth;
    state.containerWidth = this.container.offsetWidth;

    state.max = bounds(this.slider).width - state.containerWidth;
    state.cx = this.clamp(state.active * state.slideWidth);
  };

  get shouldAnimate() {
    return Math.abs(this.state.tx - this.state.cx) > 0.01;
  }

  update = (t, ct) => {
    if (!this.shouldAnimate) return;

    this.state.tx = lerp(this.state.tx, this.state.cx, this.inertia);

    this.slider.style.transform = `translate3d(${round(
      -this.state.tx
    )}px, 0, 0)`;
  };

  destroy = () => {
    this.removeDown();
    this.removeUp();
    this.removeMove();
    this.removeWheel();

    ticker.remove(this.tickID);
    ro.remove(this.roID);
  };
}
