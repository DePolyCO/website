import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { iris, qs, qsa } from "../hermes";
import { TextHighlight } from "../components/textHighlight";

/**
 *
 * Home page controller
 *
 */

let highlightFx;
export const homeController = new Controller({
  hide: ({ done }) => {
    highlightFx && highlightFx.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const highlights = qsa("[data-text-highlight");
    if (highlights.length) {
      highlightFx = new TextHighlight({
        targets: highlights,
      });
    }

    done();
  },
});
