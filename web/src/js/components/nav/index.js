import { iris, qs, qsa, Sniff, Vau } from "../../hermes";
import { smoothscroller } from "../../scroller";
import { Select } from "../select";
import { Reveal } from "../../reveal";
import { FormManager } from "../forms/manager";

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
      isVisible: false,
      hasLine: false,
      activeLink: false,
      mobileOpen: false,
    };

    this.init();
  }

  init = () => {
    this.form = new FormManager({ root: "#cta-panel" });
    // this.select = new Select({ callback: this.onLangSwitch });

    this.select = qs("#langs-select");
    this.setInitialLang();

    iris.add(this.select, "change", this.onLangSwitch);

    smoothscroller.add({ update: this.onScroll });

    if (Sniff.touchDevice) {
      iris.add(this.btn, "click", this.toggle);

      this.reveals = this.linkItems.map(
        (item) =>
          new Reveal({
            targets: qs(".nav-link--inner", item),
            from: 105,
            delay: 1 * 50,
            duration: 1750,
            skipGuarantee: true,
          })
      );

      const grid = qs("#m-bg--grid");
      const right = qs("#nav-right");

      this.bg = new Vau({
        targets: grid,
        duration: 2500,
        easing: "o6",
        transform: {
          y: [0, 50],
          yu: "%",
        },
      });
      this.navt = new Vau({
        targets: right,
        duration: 1750,
        easing: "o6",
        transform: {
          y: [0, 20],
          yu: "%",
        },
      });
    }
  };

  onScroll = ({ deltaY, y }) => {
    if (this.state.mobileOpen) return;

    const hasScrolled = y < -15;

    if (this.state.isVisible && deltaY > 0 && hasScrolled) {
      this.hide();
    } else if (!this.state.isVisible && deltaY < 0) {
      this.show();
    }

    if (this.state.isVisible) {
      if (hasScrolled && !this.state.hasLine) {
        this.addLine();
      } else if (!hasScrolled && this.state.hasLine) {
        this.removeLine();
      }
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
    document.body.classList.add("has-nav");
  };

  hide = () => {
    this.state.isVisible = false;
    this.dom.classList.add("hidden");
    document.body.classList.remove("has-nav");
  };

  onLangSwitch = (e) => {
    const value = e.target.value;
    const newLocation =
      value === "ENG" ? "https://depoly.co" : "https://fra.depoly.co";
    window.location.href = newLocation;
  };

  setInitialLang = () => {
    const currentLocation = window.location;
    const currentSubdomain = currentLocation.host.split(".")[0];
    const lang = currentSubdomain === "fra" ? "FRA" : "ENG";

    this.select.value = lang;
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
    this.state.mobileOpen = !this.state.mobileOpen;
    const action = this.state.mobileOpen ? "add" : "remove";
    this.dom.classList[action]("active");
    this.btn.classList[action]("active");

    if (Sniff.touchDevice) {
      document.documentElement.classList[action]("oh");

      this.bg.reverse();
      this.navt.reverse();

      if (this.state.mobileOpen) {
        this.reveals.forEach((r, i) =>
          r.play({
            from: -100,
            to: 0,
            stagger: 25,
            delay: i * 100,
            duration: 1750,
            visible: true,
          })
        );
      } else {
        this.reveals.forEach((r, i) =>
          r.playTo({
            to: -110,
            stagger: 0,
            delay: 0,
            duration: 500,
            visible: false,
          })
        );
      }
    }
  };
}

export const nav = new Nav();
