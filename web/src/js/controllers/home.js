import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { iris, qs, qsa } from "../hermes";
import { TextHighlight } from "../components/textHighlight";
import { Parallax } from "../scroller";

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

    const prlx = qsa("[data-parallax]");
    if (prlx.length) {
      new Parallax({
        dom: prlx[0],
        speed: 0.1,
      });
      new Parallax({
        dom: prlx[1],
        speed: 0.2,
        down: true,
      });
      new Parallax({
        dom: prlx[2],
        speed: 0.5,
      });
      new Parallax({
        dom: prlx[3],
        down: true,
        speed: 0.75,
      });
    }

    done();
  },
});
