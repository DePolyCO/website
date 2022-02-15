import { bindAll, Observer } from "../../hermes";

class FXManager {
  constructor() {
    bindAll(this, ["change"]);

    this.o = Observer().create({
      callback: this.change,
    });
  }

  change(node, isIntersecting, unobserve) {
    requestAnimationFrame(() => {
      if (isIntersecting) {
        node.classList.add("fx-on");
        if (node.classList.contains("fx-once")) {
          unobserve(node);
        }
      } else {
        node.classList.remove("fx-on");
      }
    });
  }

  add(target = ".fx") {
    this.o.observe(target);
  }

  remove(target) {
    this.o.unobserve(target);
  }

  destroy() {
    this.o.disconnect();
  }
}

export const fx = new FXManager();
