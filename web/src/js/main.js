import "./polyfills";

import { iris } from "./hermes";
import { Hydra } from "./hydra";
import { intro } from "./intro";

import { noController } from "./controllers/404";
import { aboutController } from "./controllers/about";
import { articleController } from "./controllers/article";
import { blogController } from "./controllers/blog";
import { careerController } from "./controllers/career";
import { careerInnerController } from "./controllers/careerInner";
import { contactController } from "./controllers/contact";
import { homeController } from "./controllers/home";
import { privacyController } from "./controllers/privacy";
import { techController } from "./controllers/tech";

// import { Grid } from "./grid";
import { Cookie } from "./cookie";
// import { asideController } from "./components/aside";

// import { smoothscroller } from "./scroller";
// import { footer } from "./components/footer";
import { nav } from "./components/nav";

/**
 *
 * Instantiate
 * router
 *
 *
 */

export const app = new Hydra({
  loader: async (done, currentPage) => {
    await intro.init(currentPage);
    done();
  },
  controllers: {
    home: homeController,
    about: aboutController,
    tech: techController,
    career: careerController,
    contact: contactController,
    careerInner: careerInnerController,
    privacy: privacyController,
    blog: blogController,
    article: articleController,
    404: noController,
  },
});

iris.add(
  window,
  "load",
  () => {
    console.log("Design by: FiftySeven® — https://fiftyseven.co/");
    console.log("Dev by: Siddharth S. — https://siddharthsham.com");

    // new Grid({
    //   cols: 4,
    // });

    // footer.init();
    nav.resize();

    // if (
    //   "serviceWorker" in navigator &&
    //   window.location.hostname !== "localhost"
    // ) {
    //   navigator.serviceWorker.register("/sw.js");
    // }

    idly(() => {
      new Cookie();
    });
  },
  {
    once: true,
  }
);
