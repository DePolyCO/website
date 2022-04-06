import { Controller } from "../hydra";

import { Draw, Observer, qsa, Sniff, Vau } from "../hermes";

import { Parallax } from "../scroller";
import { Reveal } from "../reveal";

import { sail } from "../components/sails";
import { TextHighlight } from "../components/textHighlight";
import { Collapse } from "../components/collapse";
import { nav } from "../components/nav";
import { monoShuffle } from "../components/monoShuffle";

/**
 *
 * Home page controller
 *
 */

let highlightFx, p1, p2, p3, p4, c1, ps, iconDraws, o, r0, rst, ph;
export const homeController = new Controller({
  hide: ({ done }) => {
    highlightFx.destroy();

    c1 && c1.destroy();
    ps && ps.length && ps.forEach((p) => p.destroy());

    p1.destroy();
    p2.destroy();
    p3.destroy();
    p4.destroy();

    ph && ph.destroy();

    r0.destroy();
    rst.destroy();
    o.disconnect();
    iconDraws.forEach((d) => d.destroy());
    monoShuffle.destroy();
    sail.out(done);
  },

  show: ({ done }) => {
    r0 = new Reveal({
      targets: "#hero-title",
      stagger: 150,
    });

    new Vau({
      targets: "#hero-picture img",
      opacity: [0, 1],
      duration: 1750,
      easing: "o6",
    });

    if (!Sniff.touchDevice) {
      ph = new Parallax({
        dom: "#hero-picture img",
        speed: 1,
        down: true,
        useOnlyOffset: true,
        offset: {
          start: 17,
          end: -17,
        },
        scale: { x: { start: 1.05 } },
        easing: "linear",
      });
    }

    new Vau({
      targets: "#hero .hero-grid",
      opacity: [0, 1],
      duration: 200,
      easing: "o6",
    });

    highlightFx = new TextHighlight({
      targets: "[data-text-highlight",
    });

    rst = new Reveal({
      targets: ".stat-title",
      auto: true,
      char: true,
      stagger: 35,
      threshold: Sniff.touchDevice ? 0.5 : 1,
    });

    const prlx = qsa("[data-parallax]");

    p1 = new Parallax({
      dom: prlx[0],
      speed: 0.1,
      rotate: { z: { start: 20, end: 0 } },
    });
    p2 = new Parallax({
      dom: prlx[1],
      speed: 0.2,
      down: true,
      rotate: { z: { start: 20, end: 0 } },
    });
    p3 = new Parallax({
      dom: prlx[2],
      speed: 0.5,
      rotate: { z: { start: 20, end: 0 } },
    });
    p4 = new Parallax({
      dom: prlx[3],
      down: true,
      speed: 0.75,
      rotate: { z: { start: 20, end: 0 } },
    });

    if (!Sniff.touchDevice) {
      ps = qsa(".stat-desc").map(
        (item) =>
          new Parallax({
            dom: item,
            ease: "io2",
            limitBounds: true,
            speed: 2,
          })
      );
      c1 = new Collapse();
    }

    nav.setLinkActive("home");

    const icons = qsa(".icon");
    iconDraws = icons.map((el) =>
      Draw({
        targets: el,
        duration: 1750,
        easing: "o6",
      })
    );
    iconDraws.forEach((d) => d.pause());

    o = Observer.create({
      callback: (node, isIntersecting, unobserve) => {
        if (isIntersecting) {
          for (let i = 0, n = icons.length; i < n; i++) {
            const el = icons[i];
            if (node === el) {
              iconDraws[i].play();
              unobserve(node);
              break;
            }
          }
        }
      },
      threshold: 1,
    });

    o.observe(icons);

    monoShuffle.init();

    r0.play();

    sail.in();
    done();
  },
});
