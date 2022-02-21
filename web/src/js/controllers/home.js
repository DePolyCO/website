import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Parallax } from "../scroller";

import { qsa } from "../hermes";
import { Collapse } from "../components/collapse";

/**
 *
 * Home page controller
 *
 */

let highlightFx, p1, p2, p3, p4, c1;
export const homeController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    p1.destroy();
    p2.destroy();
    p3.destroy();
    p4.destroy();
    c1.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    const prlx = qsa("[data-parallax]");

    p1 = new Parallax({
      dom: prlx[0],
      speed: 0.1,
    });
    p2 = new Parallax({
      dom: prlx[1],
      speed: 0.2,
      down: true,
    });
    p3 = new Parallax({
      dom: prlx[2],
      speed: 0.5,
    });
    p4 = new Parallax({
      dom: prlx[3],
      down: true,
      speed: 0.75,
    });

    c1 = new Collapse();

    done();
  },
});
