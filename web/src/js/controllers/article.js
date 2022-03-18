import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";

import { Reveal } from "../reveal";
import { Vau } from "../hermes";

import { Tweeter } from "../components/highlightTweet";

/**
 *
 * Article Prolicy page controller
 *
 */

let r0, tw;
export const articleController = new Controller({
  hide: ({ done }) => {
    r0.destroy();
    tw.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    nav.unsetLinkActive();

    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });
    r0.play();

    tw = new Tweeter();

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      transform: {
        sx: [1.35, 1],
        sy: [1.35, 1],
      },
      duration: 1750,
      easing: "o6",
    });

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    new Vau({
      targets: "#article-breadcrumbs",
      opacity: [0, 1],
      duration: 200,
    });

    new Vau({
      targets: "#hero .article-tag",
      opacity: [0, 1],
      duration: 200,
    });

    sail.in();
    done();
  },
});
