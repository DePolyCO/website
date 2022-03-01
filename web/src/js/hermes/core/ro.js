import { Sniff, bindAll, Throttle, Conductor } from "../utils";
import { iris } from "../iris";

class RO extends Conductor {
  constructor() {
    super();

    this.throttledUpdate = Throttle({ update: this.update, onlyAtEnd: true });
    this.listen();
  }

  listen = () => {
    iris.add(
      window,
      Sniff.mobile ? "orientationchange" : "resize",
      this.throttledUpdate
    );
  };

  update = () => {
    const bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const n = this.train.length;
    for (let i = 0; i < n; i++) {
      this.train[i].update(bounds);
    }
  };
}

export const ro = new RO();
