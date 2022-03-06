import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { FormManager } from "../components/forms";
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
    nav.setLinkActive("contact");

    undetail = iris.add("summary", "click", () => {
      setTimeout(smoothscroller.resize, 0);
    });

    new FormManager();

    sail.in();
    done();
  },
});
