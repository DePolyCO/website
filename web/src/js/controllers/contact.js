import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { iris } from "../hermes";
import { smoothscroller } from "../scroller";

/**
 *
 * 404 page controller
 *
 */

let undetail;
export const contactController = new Controller({
  hide: ({ done }) => {
    undetail();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    nav.setLinkActive("contact");

    undetail = iris.add("details", "click", () => {
      setTimeout(smoothscroller.resize, 0);
    });

    done();
  },
});
