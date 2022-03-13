import "./polyfills";

import { Hydra } from "./hydra";
import { iris, ro } from "./hermes";
import { intro } from "./intro";

import { homeController } from "./controllers/home";
import { aboutController } from "./controllers/about";
import { techController } from "./controllers/tech";
import { careerController } from "./controllers/career";
import { careerInnerController } from "./controllers/careerInner";
import { newsController } from "./controllers/news";
import { contactController } from "./controllers/contact";
import { privacyController } from "./controllers/privacy";
import { noController } from "./controllers/404";

import { Grid } from "./grid";
import { asideController } from "./components/aside";

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
  loader: async (done, currentPage) => {
    await intro.init(currentPage);
    done();
  },
  controllers: {
    home: homeController,
    about: aboutController,
    tech: techController,
    career: careerController,
    news: newsController,
    contact: contactController,
    careerInner: careerInnerController,
    privacy: privacyController,
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

    footer.init();
    nav.init();

    // if (
    //   "serviceWorker" in navigator &&
    //   window.location.hostname !== "localhost"
    // ) {
    //   navigator.serviceWorker.register("/sw.js");
    // }
  },
  {
    once: true,
  }
);
