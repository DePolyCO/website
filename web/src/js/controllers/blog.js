import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { qsa, Vau } from "../hermes";

/**
 *
 * Blog Prolicy page controller
 *
 */

export const blogController = new Controller({
  hide: ({ done }) => {
    sail.out(done);
  },

  show: ({ done }) => {
    nav.unsetLinkActive();

    qsa(".article-animate").map(
      (item, i) =>
        new Vau({
          targets: item,
          opacity: [0, 1],
          easing: "o6",
          duration: 1000,
        })
    );

    qsa(".article-card").map(
      (item, i) =>
        new Vau({
          targets: item,
          transform: {
            y: [150, 0],
          },
          opacity: [0, 1],
          easing: "o6",
          duration: 1750,
          delay: i * 100,
        })
    );

    sail.in();
    done();
  },
});
