import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { CaptureReveal } from "../components/captureReveal";
import { asideController } from "../components/aside";
import { nav } from "../components/nav";

import { qsa } from "../hermes";
import { Reveal } from "../reveal";

/**
 *
 * About page controller
 *
 */

let highlightFx, numbers, r0;

export const aboutController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    numbers.destroy();
    asideController.destroy();
    r0.destroy();

    sail.out(done);
  },

  show: ({ done }) => {
    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    numbers = new CaptureReveal();

    asideController.init();

    nav.setLinkActive("about");

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    sail.in();
    done();
  },
});
