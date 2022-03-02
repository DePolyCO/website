import { Tracker } from "./tracker";
import { ticker } from "../hermes";

export class Trigger {
  constructor({ visible, hidden, pin, start, end, intersectionPoints = {} }) {
    this.options = {
      start,
      end,
      pin,
    };
    this.callbacks = {
      visible,
      hidden,
    };
    this.tracker = new Tracker({ useIntersection: true, intersectionPoints });

    this.init();
  }

  init = () => {
    this.tickID = ticker.add({ update: this.update });
  };

  setScroll = (x, y) => {
    this.tracker.setScroll(x, y);
  };

  update = () => {
    this.tracker.detectElements();

    const { visible, hidden } = this.callbacks;

    this.tracker.train.forEach((item) => {
      if (item.visible && visible) {
        item.markedVisible = true;
        visible(item);
      } else if (item.markedVisible && hidden) {
        item.markedVisible = false;
        hidden(item);
      }
    });
  };

  destroy = () => {
    ticker.remove(this.tickID);
  };
}
