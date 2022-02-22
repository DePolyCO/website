import { qs } from "../../hermes";
import { smoothscroller } from "../../scroller";

export class Nav {
  constructor() {
    this.dom = qs("#nav");
    this.state = {
      isVisible: true,
    };
  }

  init = () => {
    smoothscroller.add({ update: this.onScroll });
  };

  onScroll = ({ deltaY }) => {
    if (this.state.isVisible && deltaY > 0) {
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
}

export const nav = new Nav();