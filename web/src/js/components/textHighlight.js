import { qsa, ro, select, Sniff, ticker } from "../hermes";
import { Tracker, smoothscroller, corescroller } from "../scroller";

export class TextHighlight {
  constructor({ targets, intersectionPoints = {} }) {
    this.intersectionPoints = {
      bottom: Sniff.touchDevice ? 1 : 0.33,
      ...intersectionPoints,
    };

    this.tracker = new Tracker({
      useDetectionPlane: false,
      intersectionPoints: this.intersectionPoints,
    });

    select(targets).forEach((el) => {
      this.build(el);
    });

    this.scrollID = smoothscroller.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });
    this.tickID = ticker.add({ update: this.render });
  }

  build = (el) => {
    const children = [...el.children];

    children.forEach((item, i) => {
      item.classList.add("text-underlay");
      item.dataset.content = item.innerHTML;

      //   skip first element
      // if (i > 0) {
      this.tracker.add({ dom: item });
      // }
    });

    // first one is permanently active
    // children[0].classList.add("text-underlay--always");
  };

  update = ({ x, y }) => {
    this.tracker.setScroll(x, -y);
  };

  render = () => {
    this.tracker.detectElements();
    this.tracker.train.forEach((item, i) => {
      if (item.visible && !item.active) {
        item.active = true;
        this.setActive(item);
      } else if (!item.visible && item.active) {
        item.active = false;
        this.setInactive(item);
      }
    });
  };

  setActive = (item) => {
    item.dom.classList.add("text-underlay--active");
  };

  setInactive = (item) => {
    item.dom.classList.remove("text-underlay--active");
  };

  resize = () => {
    this.tracker.resize();
  };

  destroy = () => {
    this.tracker.destroy();
    ro.remove(this.roID);
    smoothscroller.remove(this.scrollID);
  };
}
