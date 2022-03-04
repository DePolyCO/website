import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";

import { qsa } from "../hermes";
import { CaptureReveal } from "../components/captureReveal";
import { asideController } from "../components/aside";
import { nav } from "../components/nav";

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
    asideController.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    numbers = new CaptureReveal();
    window.numbers = numbers;

    asideController.init();

    nav.setLinkActive("about");

    sail.in();
    done();
  },
});
