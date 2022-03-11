import { iris, qs } from "../../hermes";
import { FooterHover } from "./footerHover";

import { FooterSlider } from "./footerSlider";

export class Footer {
  constructor() {
    this.dom = qs("#footer");

    this.slider = new FooterSlider({ dom: this.dom });
    this.hover = new FooterHover({ dom: this.dom });

    this.form = qs("form", this.dom);
  }

  init = () => {
    this.slider.init();

    iris.add(this.form, "submit", this.handleSubmit, { passive: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const email = qs("#footer-email", this.form).value;
    const name = qs("#footer-name", this.form).value;

    this.post(email, name);
  };

  post = async (email, name) => {
    const res = await fetch("/.netlify/functions/form-handler", {
      method: "post",
      body: JSON.stringify({
        email,
        name,
      }),
    });

    const data = await res.json();

    console.log("data from function", data);
  };
}

export const footer = new Footer();
