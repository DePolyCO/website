import { qs } from "../../hermes";
import { smoothscroller } from "../../scroller";
import { Select } from "../select";

export class Nav {
  constructor() {
    this.dom = qs("#nav");
    this.state = {
      isVisible: true,
    };
  }

  init = () => {
    this.select = new Select({ callback: this.onLangSwitch });
    smoothscroller.add({ update: this.onScroll });
  };

  onScroll = ({ deltaY, y }) => {
    if (this.state.isVisible && deltaY > 0 && y < -15) {
      this.hide();
    } else if (!this.state.isVisible && deltaY < 0) {
      this.show();
    }
  };

  show = () => {
    this.state.isVisible = true;
    this.dom.classList.remove("hidden");
  };

  hide = () => {
    this.state.isVisible = false;
    this.dom.classList.add("hidden");
  };

  onLangSwitch = (value, isOpen) => {
    console.log("lang switched to:", value);
  };
}

export const nav = new Nav();
