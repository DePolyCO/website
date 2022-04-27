import { Sniff, Throttle, Conductor } from "../utils";
import { iris } from "../iris";

class RO extends Conductor {
  constructor() {
    super();

    this.bounds = { vw: window.innerWidth, vh: window.innerHeight };
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
    this.bounds = { vw: window.innerWidth, vh: window.innerHeight };
    const n = this.train.length;
    for (let i = 0; i < n; i++) {
      this.train[i].update(this.bounds);
    }
  };
}

export const ro = new RO();
