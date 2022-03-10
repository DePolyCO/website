import { iris, qs, qsa, Sniff } from "../../hermes";
import { smoothscroller } from "../../scroller";
import { Select } from "../select";

export class Nav {
  constructor() {
    this.dom = qs("#nav");
    this.btn = qs("#nav-trigger", this.dom);
    this.linkItems = qsa(".nav-item", this.dom);

    this.links = {};
    this.linkItems.forEach((link) => {
      this.links[link.dataset.page] = link;
    });

    this.state = {
      isVisible: true,
      hasLine: false,
      activeLink: false,
    };

    window.nav = this;
  }

  init = () => {
    this.select = new Select({ callback: this.onLangSwitch });
    this.setInitialLang();

    if (Sniff.touchDevice) {
      iris.add(this.linkItems, "click", this.toggle);
      iris.add(this.btn, "click", this.toggle);
    } else {
      smoothscroller.add({ update: this.onScroll });
    }
  };

  onScroll = ({ deltaY, y }) => {
    const hasScrolled = y < -15;

    if (hasScrolled && !this.state.hasLine) {
      this.addLine();
    } else if (!hasScrolled && this.state.hasLine) {
      this.removeLine();
    }

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
    const newLocation =
      value === "ENG" ? "https://depoly.ch" : "https://fra.depoly.ch";
    // window.location.href = newLocation;
    console.log("lang switched to:", value);
    console.log("Point to:", newLocation);
  };

  setInitialLang = () => {
    const currentLocation = window.location;
    const currentSubdomain = currentLocation.host.split(".")[0];
    const lang = currentSubdomain === "fra" ? "FRA" : "ENG";

    this.select.setActiveValue(lang);
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

  toggle = () => {
    this.dom.classList.toggle("active");
    this.btn.classList.toggle("active");
    document.body.classList.toggle("oh");
  };
}

export const nav = new Nav();
