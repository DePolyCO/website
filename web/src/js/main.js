import "./polyfills";

import { Hydra } from "./hydra";
import { iris, ro } from "./hermes";
import { intro } from "./intro";

import { homeController } from "./controllers/home";
import { aboutController } from "./controllers/about";
import { techController } from "./controllers/tech";
import { careerController } from "./controllers/career";
import { noController } from "./controllers/404";

import { Grid } from "./grid";
import { asideController } from "./components/aside";

// import { corescroller } from "./scroller";
import { smoothscroller } from "./scroller";
import { footer } from "./components/footer";
import { nav } from "./components/nav";

/**
 *
 * Instantiate
 * router
 *
 *
 */

new Hydra({
  loader: async (done) => {
    await intro.init();
    done();
  },
  controllers: {
    home: homeController,
    about: aboutController,
    tech: techController,
    career: careerController,
    404: noController,
  },
});

iris.add(
  window,
  "load",
  () => {
    console.log("Design by: FiftySeven® — https://fiftyseven.co/");
    console.log("Dev by: Siddharth S. — https://siddharthsham.com");

    new Grid({
      cols: 4,
    });

    // window.corescroller = corescroller;
    window.smooth = smoothscroller;
    // window.footer = footer;
    // window.aside = asideController;

    asideController.test();
    footer.init();
    nav.init();
    window.nav = nav;
    // smoothscroller.resize();

    ro.update();

    if (
      "serviceWorker" in navigator &&
      window.location.hostname !== "localhost"
    ) {
      navigator.serviceWorker.register("/sw.js");
    }
  },
  {
    once: true,
  }
);
