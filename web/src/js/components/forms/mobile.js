import { qs, qsa } from "../../hermes";
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
    this.onSelect(0);
  }

  build = () => {
    this.forms.forEach((form) => {
      form.style.display = "none";
      form.open = "true";
    });
  };

  destroy = () => {};

  onSelect = (value) => {
    value = parseInt(value);

    this.forms[this.current].style.display = "none";
    this.forms[value].style.display = "block";

    this.current = value;
  };
}
