import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Compare } from "../components/compare";
import { nav } from "../components/nav";

import { qsa } from "../hermes";
import { Parallax } from "../scroller";
import { Reveal } from "../reveal";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * Tech page controller
 *
 */

let highlightFx, compares, ps, r0;
export const techController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();
    compares.forEach((compare) => compare.destroy());
    ps.forEach((p) => p.destroy());
    r0.destroy();

    monoShuffle.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    const highlights = qsa("[data-text-highlight");

    highlightFx = new TextHighlight({
      targets: highlights,
    });
    window.highlight = highlightFx;

    compares = qsa("[data-compare-slider").map(
      (item) => new Compare({ dom: item })
    );

    ps = qsa(".explain-item").map(
      (item) => new Parallax({ dom: item, ease: "io2" })
    );

    nav.setLinkActive("technology");

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    monoShuffle.init();
    sail.in();
    done();
  },
});
