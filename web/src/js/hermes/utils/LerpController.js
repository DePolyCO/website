import { lerp } from "./MathUtils";
import { bindAll } from "./BindAll";

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
  }

  needsUpdate = () => {
    this.delta = Math.abs(this.obj.cur - this.obj.target);
    return this.delta > this.threshold;
  };

  update = () => {
    this.obj.target = lerp(this.obj.target, this.obj.cur, this.obj.inertia);
  };
}
