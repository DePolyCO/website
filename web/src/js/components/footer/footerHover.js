import { iris, qs, qsa } from "../../hermes";

export class FooterHover {
  constructor({ dom }) {
    this.dom = dom;
    this.targets = qsa("[data-footer-hover]", dom).map((item) => {
      const wrapper = qs(".tag-wrapper", item);
      const tag = qs(".footer-tag", wrapper);
      const hover = qs(".hover-item", item);
      return {
        wrapper,
        hover,
        tag,
        content: item.dataset.footerHover,
      };
    });

    this.listen();
  }

  listen = () => {
    this.unlisteners = [];
    this.targets.forEach((item, i) => {
      if (!item.hover) return;
      const u0 = iris.add(item.hover, "pointerenter", () => this.in(i));
      const u1 = iris.add(item.hover, "pointerleave", () => this.out(i));
      let u2;
      if (!item.hover.dataset.noCopy) {
        u2 = iris.add(item.hover, "click", () => this.click(i));
      }

      this.unlisteners.push(u0, u1);
      u2 && this.unlisteners.push(u2);
    });
  };

  in = (i) => {
    this.targets[i].wrapper.classList.add("active");
  };

  out = (i) => {
    this.targets[i].wrapper.classList.remove("active");
  };

  click = (i) => {
    navigator.clipboard.writeText(this.targets[i].content).then(
      () => {
        this.targets[i].tag.innerHTML = "Copied!";
        setTimeout(() => {
          this.targets[i].tag.innerHTML = "Copy to clipboard";
        }, 1500);
      },
      () => {}
    );
  };

  destroy = () => {
    this.unlisteners.forEach((u) => u());
  };
}
