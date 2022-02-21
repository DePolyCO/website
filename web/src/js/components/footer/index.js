import { qs } from "../../hermes";
import { FooterHover } from "./footerHover";

import { FooterSlider } from "./footerSlider";

export class Footer {
  constructor() {
    this.dom = qs("#footer");

    this.slider = new FooterSlider({ dom: this.dom });
    this.hover = new FooterHover({ dom: this.dom });
  }

  init() {
    this.slider.init();
  }
}

export const footer = new Footer();
