import { bindAll } from "./BindAll";
import { Conductor } from "./Conductor";
import { Observer } from "./Observer";

export class Visible extends Conductor {
  constructor() {
    super();

    this.o = Observer.create({});
    bindAll(this, ["change"]);
  }

  //   {
  //       dom: node,
  //       visible: false
  //   }

  add(el) {
    super(el);
    this.o.observe(el.dom);
  }

  change(node, isIntersecting, unobserve) {
    if (isIntersecting) {
      this.anim.play();
    } else {
      this.anim.pause();
    }
  }
}
