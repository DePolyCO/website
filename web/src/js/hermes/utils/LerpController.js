import { lerp, damp } from "./MathUtils";
import { ticker } from "..";

/**
 *
 * Takes object with required shape:
 *
 * const obj = {
 *  target: 0,
 *  cur: 0,
 *  inertia: 0.1
 * }
 *
 */

export class LerpController {
  constructor(obj, threshold = 0.001) {
    this.obj = obj;
    this.threshold = threshold;

    this.setInertia(obj.inertia);
  }

  setInertia = (n) => {
    this.inertia = Math.log(1 - n / 15);
  };

  needsUpdate = () => {
    this.delta = Math.abs(this.obj.cur - this.obj.target);
    return this.delta > this.threshold;
  };

  update = () => {
    this.obj.target = damp(
      this.obj.target,
      this.obj.cur,
      this.inertia,
      ticker.delta
    );
  };
}
