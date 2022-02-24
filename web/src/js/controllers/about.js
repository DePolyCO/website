import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";

import { qsa } from "../hermes";
import { CaptureReveal } from "../components/captureReveal";

/**
 *
 * About page controller
 *
 */

let highlightFx, numbers;

export const aboutController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    numbers.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    numbers = new CaptureReveal();
    done();
  },
});
