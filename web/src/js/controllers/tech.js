import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";

import { qsa } from "../hermes";

/**
 *
 * Tech page controller
 *
 */

let highlightFx;
export const techController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    done();
  },
});
