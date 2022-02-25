import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Compare } from "../components/compare";

import { qsa } from "../hermes";
import { Parallax } from "../scroller";
import { nav } from "../components/nav";

/**
 *
 * Tech page controller
 *
 */

let highlightFx, compares, p1, p2, p3, p4, ps;
export const techController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    compares.forEach((compare) => compare.destroy());
    ps.forEach((p) => p.destroy());
    sail.out(done);
  },

  show: ({ done }) => {
    sail.in();

    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });

    compares = qsa("[data-compare-slider").map(
      (item) => new Compare({ dom: item })
    );

    ps = qsa(".explain-item").map(
      (item) => new Parallax({ dom: item, ease: "io2" })
    );

    nav.setLinkActive("technology");

    done();
  },
});
