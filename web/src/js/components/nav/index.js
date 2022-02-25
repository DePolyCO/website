import { qs, qsa } from "../../hermes";
import { smoothscroller } from "../../scroller";
import { Select } from "../select";

export class Nav {
  constructor() {
    this.dom = qs("#nav");

    this.links = {};
    qsa(".nav-item", this.dom).forEach((link) => {
      this.links[link.dataset.page] = link;
    });

    this.state = {
      isVisible: true,
      hasLine: false,
      activeLink: false,
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

  onLangSwitch = (value) => {
    console.log("lang switched to:", value);
  };

  setLinkActive = (pageName) => {
    if (this.state.activeLink) {
      this.links[this.state.activeLink].classList.remove("active");
    }
    this.links[pageName].classList.add("active");
    this.state.activeLink = pageName;
  };

  unsetLinkActive = () => {
    if (this.state.activeLink) {
      this.links[this.state.activeLink].classList.remove("active");
    }
    this.state.activeLink = false;
  };
}

export const nav = new Nav();
