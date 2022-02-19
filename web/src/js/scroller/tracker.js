import { Conductor, ro } from "../hermes";

/**
 *
 * In-viewport detection
 *
 * tracker.add({ dom: domEl, update: () => {}, direction: "horizontal"})
 *
 */

const getOffsetTop = (el) => {
  let top = 0;
  let clone = el;
  while (clone.offsetParent) {
    top += clone.offsetTop;
    clone = clone.offsetParent;
  }
  return top;
};

export class Tracker extends Conductor {
  constructor({
    useDetectionPlane = true,
    needsResize = false,
    intersectionPoints = {},
  } = {}) {
    super();

    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    this.useDetectionPlane = useDetectionPlane;
    this.intersectionPoints = {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      ...intersectionPoints,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    if (needsResize) {
      this.roID = ro.add({
        update: this.resize,
      });
    }
  }

  setScroll = (x, y) => {
    if (this.train.length) {
      this.scroll.x = x;
      this.scroll.y = y;
      this.detectElements();
    }
  };

  resize = () => {
    if (this.train.length) {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
      this.updateElements();
    }
  };

  detectElements() {
    const { top, right, bottom, left } = this.intersectionPoints;

    const scrollTop = this.scroll.y + this.windowHeight * top;
    const scrollBottom =
      this.scroll.y + this.windowHeight - this.windowHeight * bottom;
    const scrollLeft = this.scroll.x + this.windowWidth * left;
    const scrollRight = this.scroll.x - this.windowWidth * right;

    this.train.forEach((item, i) => {
      if (!item.visible) {
        if (item.direction === "horizontal") {
          if (scrollRight >= item.left && scrollLeft < item.right) {
            this.setInView(item, i);
          }
        } else {
          if (this.useDetectionPlane) {
            if (scrollBottom > item.top && scrollTop < item.bottom) {
              this.setVisible(item, i);
            }
          } else {
            if (scrollBottom > item.top) {
              this.setVisible(item, i);
            }
          }
        }
      } else {
        if (item.direction === "horizontal") {
          if (scrollRight < item.left || scrollLeft > item.right) {
            this.setOutOfView(item, i);
          }
        } else {
          if (this.useDetectionPlane) {
            if (scrollBottom < item.top || scrollTop > item.bottom) {
              this.setInvisible(item, i);
            }
          } else {
            if (scrollBottom < item.top) {
              this.setInvisible(item, i);
            }
          }
        }
      }
    });
  }

  setVisible(el, i) {
    el.visible = true;
  }

  setInvisible(el, i) {
    el.visible = false;
  }

  getIntersection({
    top,
    bottom,
    left,
    right,
    x = this.scroll.x,
    y = this.scroll.y,
  }) {
    const state = {
      progress: 0,
      visible: false,
    };
    if (y > top && y < bottom) {
      state.visible = true;
      state.progress = (y - top) / (bottom - top + this.windowHeight);
    }

    return state;
  }

  add(item) {
    const top = item.dom.getBoundingClientRect().top;
    const bottom = top + item.dom.offsetHeight;

    item.top = top;
    item.bottom = bottom;
    item.visible = false;

    super.add(item);
  }

  updateElements() {
    this.train.forEach((item, i) => {
      const top = getOffsetTop(item.dom);
      const bottom = top + item.dom.offsetHeight;

      item.top = top;
      item.bottom = bottom;
    });
  }

  destroy() {
    this.roID && ro.remove(this.roID);
  }
}

export const tracker = new Tracker();
