import { Controller } from "../hydra";

import { sail } from "../components/sails";
import { nav } from "../components/nav";
import { iris, qs, qsa, Vau } from "../hermes";
import { Engine } from "../components/blogEngine";

/**
 *
 * Blog Prolicy page controller
 *
 */

let ficl, s1;
export const blogController = new Controller({
  hide: ({ done }) => {
    ficl && ficl();
    s1.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    nav.setLinkActive("news");

    new Vau({
      targets: qsa(".article-animate"),
      opacity: [0, 1],
      easing: "o6",
      duration: 1000,
    });

    qsa(".article-card")
      .slice(0, 3)
      .map(
        (item, i) =>
          new Vau({
            targets: item,
            transform: {
              y: [150, 0],
            },
            opacity: [0, 1],
            easing: "o6",
            duration: 1750,
            delay: i * 100,
          })
      );

    const fi = qs("#filters-extended");
    const btn = qs("#filters-extended--btn");
    ficl = iris.add(btn, "click", (e) => {
      fi.classList.toggle("active");
      btn.classList.toggle("active");
    });

    s1 = new Engine();

    sail.in();
    done();
  },
});
