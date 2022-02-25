import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

/**
 *
 * 404 page controller
 *
 */

export const newsController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();
    nav.setLinkActive("news");
    done();
  },
});
