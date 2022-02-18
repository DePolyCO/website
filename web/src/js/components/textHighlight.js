import { qsa, ro } from "../hermes";
import { Tracker, smoothscroller } from "../nscroller";

export class TextHighlight {
  constructor({ targets, intersectionPoints = {} }) {
    this.intersectionPoints = {
      bottom: 0.33,
      ...intersectionPoints,
    };

    this.tracker = new Tracker({
      useDetectionPlane: false,
      intersectionPoints: this.intersectionPoints,
    });

    qsa(targets).forEach((el) => {
      this.build(el);
    });

    smoothscroller.add({ update: this.update });
    this.roID = ro.add({ update: this.resize });
  }

  build = (el) => {
    const children = [...el.children];

    children.forEach((item, i) => {
      item.classList.add("text-underlay");
      item.dataset.content = item.innerHTML;

      //   skip first element
      if (i > 0) {
        this.tracker.add({ dom: item });
      }
    });

    // first one is permanently active
    children[0].classList.add("text-underlay--always");
  };

  update = ({ x, y }) => {
    this.tracker.setScroll(x, -y);
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
    // requestAnimationFrame(() => {});
  };

  destroy = () => {
    ro.remove(this.roID);
  };
}
