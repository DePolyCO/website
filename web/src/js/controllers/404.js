import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { ErrorScroll } from "../components/error";
import { nav } from "../components/nav";

/**
 *
 * 404 page controller
 *
 */

let errScroller;
export const noController = new Controller({
  hide: ({ done }) => {
    errScroller.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    errScroller = new ErrorScroll();
    nav.unsetLinkActive();

    sail.in();
    done();
  },
});
