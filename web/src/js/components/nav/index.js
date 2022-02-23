import { qs } from "../../hermes";
import { smoothscroller } from "../../scroller";
import { Select } from "../select";

export class Nav {
  constructor() {
    this.dom = qs("#nav");
    this.state = {
      isVisible: true,
      hasLine: false,
    };
  }

  init = () => {
    this.select = new Select({ callback: this.onLangSwitch });
    smoothscroller.add({ update: this.onScroll });
  };

  onScroll = ({ deltaY, y }) => {
    const hasScrolled = y < -15;

    // if (hasScrolled && !this.state.hasLine) {
    //   this.addLine();
    // } else if (!hasScrolled && this.state.hasLine) {
    //   this.removeLine();
    // }

    if (this.state.isVisible && deltaY > 0 && hasScrolled) {
      this.hide();
    } else if (!this.state.isVisible && deltaY < 0) {
      this.show();
    }
  };

  addLine = () => {
    this.state.hasLine = true;
    this.dom.classList.add("has-line");
  };

  removeLine = () => {
    this.state.hasLine = false;
    this.dom.classList.remove("has-line");
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
