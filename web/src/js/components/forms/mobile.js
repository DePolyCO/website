import { qs, qsa, iris } from "../../hermes";
import { Select } from "../select";

export class MobileForms {
  constructor() {
    this.select = new Select({
      dom: "#dropdown-m--wrapper",
      active: "#dropdown-m--active > div",
      callback: this.onSelect,
    });
    this.current = 0;
    this.forms = qsa(".form-details");

    this.build();
    this.listen();
    this.onSelect(0);
  }

  build = () => {
    this.forms.forEach((form) => {
      form.style.display = "none";
      form.open = "true";
    });
  };

  listen = () => {
    const inputs = this.forms.map((form) => qsa("input", form));
    this.unref = [];

    inputs.map((inputs) => {
      inputs.forEach((input) => {
        if (input.dataset?.ref?.length) {
          this.unref.push(
            iris.add(qs(`#${input.dataset.ref}`), "change", (e) => {
              if (e.target.value !== "other") {
                input.parentNode.style.display = `none`;
                return;
              }
              input.parentNode.style.display = `block`;
            })
          );
        }
      });
    });
  };

  destroy = () => {
    this.select.destroy();
    this.unref.forEach((e) => e());
  };

  toggle = () => {
    this.underlay.classList.toggle("active");
  };

  onSelect = (value) => {
    value = parseInt(value);

    this.forms[this.current].style.display = "none";
    this.forms[value].style.display = "block";

    this.current = value;
  };
}
