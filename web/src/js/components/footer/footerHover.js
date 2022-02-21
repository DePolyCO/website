import { iris, qs, qsa } from "../../hermes";

export class FooterHover {
  constructor({ dom }) {
    this.dom = dom;
    this.targets = qsa("[data-footer-hover]").map((item, i) => {
      const wrapper = qs(".tag-wrapper", item);
      const tag = qs(".footer-tag", wrapper);
      const hover = qs(".link", item);
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
    this.targets.forEach((item, i) => {
      iris.add(item.hover, "pointerenter", () => this.in(i));
      iris.add(item.hover, "pointerleave", () => this.out(i));
      iris.add(item.hover, "click", () => this.click(i));
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
}
