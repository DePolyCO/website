import { qs, lerp } from "../hermes";
import { Capture } from "./capture";

export class ErrorScroll {
  constructor() {
    this.dom = qs("#hero-title");
    this.capture = new Capture({
      window: qs("#hero-title--wrapper"),
      dom: this.dom,
      namespace: "error-page",
      callback: this.update,
    });
  }

  update = (progress, easedProgress) => {
    const lerpY = lerp(0, -this.capture.state.page.width, easedProgress);
    this.dom.style.transform = `translate3d(${lerpY}px, 0, 0)`;
  };

  destroy = () => {
    this.capture.destroy();
  };
}
