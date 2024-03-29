import { footer } from "../components/footer";
import { nav } from "../components/nav";
import { qs, qsa, iris, unique, lazyloader, ro, Sniff } from "../hermes";
import { smoothscroller } from "../scroller";
import { Store } from "../store";
import { asideController } from "../components/aside";
import { Reveal } from "../reveal";
import { fx } from "../components/fxmanager";

const PARSER = new DOMParser();

/**
 *
 * TODO:
 * =====
 *
 *  - Use append instead of replace
 *    in order to allow parallel rendering of
 *    old and new screens
 *
 */

export class Hydra {
  constructor({
    root = "[data-hydra-root]",
    content = "[data-hydra-content]",
    controllers,
    loader,
    preload,
  }) {
    Object.assign(this, {
      root: qs(root),
      content,
      controllers,
      loader,
      preload,
    });

    this.state = {};
    this.cache = new Map();
    this.isRunning = false;

    this.init();
    this.intro();
  }

  init() {
    const data = this.domData();
    data.url = location.href;
    // make a clone to avoid incorrect caching
    data.view = data.view.cloneNode(true);
    this.cache.set(data.url, data);

    Object.assign(this.state, data);

    this.listeners(true);
  }

  intro() {
    const resolve = () => {
      this.controllers[this.state.name].show({
        from: "intro",
        done: () => {
          this.isRunning = false;
          idly(() => this.runPreload(this.preload));
        },
      });
    };
    this.loader(resolve, this.state.name);
  }

  runPreload = (urls = []) => {
    urls.forEach((url) => {
      if (!this.cache.has(url)) {
        this.network(url);
      }
    });
  };

  listeners(addPop = false) {
    this.links = qsa(`a[href^="/"]:not([target]):not([data-hydra-disabled])`);

    this.cleanup && this.cleanup();
    this.cleanup = iris.add(
      this.links,
      "click",
      (e) => {
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

        e.preventDefault();
        if (this.isRunning) return;

        const node = e.target.closest("a");
        // while (node.tagName !== "A") {
        //   node = node.parentNode;
        // }

        const url = node.href;
        // if (url === this.state.url) return;

        this.goto(url, false, node);
      },
      {
        passive: false,
      }
    );

    // get all urls on page and cache
    const urls = this.links.map((link) => {
      let node = link;
      while (node.tagName !== "A") {
        node = node.parentNode;
      }
      return node.href;
    });
    // preload all urls on page
    idly(() => {
      this.runPreload(urls.filter(unique));
    });

    if (!addPop) return;
    iris.add(
      window,
      "popstate",
      (e) => {
        e.stopPropagation();
        e.preventDefault();

        const newURL = location.href;

        // prevent routing in cases where the pathname does not change
        // for eg, when updating URLSearchParams
        if (location.pathname === this.state.url) {
          return;
        }

        this.goto(newURL, true);
      },
      {
        passive: false,
      }
    );
  }

  async network(url) {
    const res = await fetch(url);
    const absURL = res.url;
    const text = await res.text();

    const dom = PARSER.parseFromString(text, "text/html");
    const data = this.domData(dom);
    data.url = absURL;

    this.cache.set(absURL, data);
    return data;
  }

  domData(dom = document) {
    const view = qs(this.content, dom);
    const title = dom.title;
    const name = view.dataset.hydraContent;

    return { view, title, name };
  }

  async fetch(url) {
    return new Promise(async (resolve, reject) => {
      if (this.cache.has(url)) {
        resolve(this.cache.get(url));
      } else {
        const data = await this.network(url);
        resolve(data);
      }
    });
  }

  async goto(url, fromPop = false, node) {
    this.isRunning = true;

    // run animate out
    // and ajax fetch in
    // parallel
    const [data, _] = await Promise.all([this.fetch(url), this.out(url)]);

    // route first, so that new url is available in next renderer
    !fromPop && this.route(url);

    this.in(data, node);
  }

  route(url) {
    history.pushState({ page: url }, "", url);
  }

  in(data, node) {
    const dom = data.view.outerHTML;
    Store.dom = dom;
    this.root.innerHTML = dom;
    document.title = data.title;
    // TODO: copy all meta tags?

    this.listeners();

    const fromURL = this.state.url;
    Object.assign(this.state, data);

    this.controllers[data.name].show({
      from: new URL(fromURL).pathname.split("/")[1],
      done: () => {
        this.isRunning = false;

        // if (!node) return;
        // scroller.scrollByAnchor(node, true);
      },
    });

    // Handle GA Analytics
    if (Store.cookie) {
      try {
        gtag("set", "page", data.url);
        gtag("send", "pageview");
      } catch (e) {
        // console.warn("[HYDRA]:", e);
      }
    }
  }

  async out(url) {
    await new Promise((resolve) => {
      this.controllers[this.state.name].hide({
        done: resolve,
        to: new URL(url).pathname.split("/")[1],
      });
    });
  }
}

/**
 *
 *
 *
 *
 * Controller
 * ----------
 *
 * + Manage show/hide animations
 * + Manage app logic
 * + Change cursor style to show waiting
 *
 * Todo:
 * ======
 * + Split into build and play phases
 *
 *
 *
 *
 */

let r0;
export class Controller {
  constructor({ hide, show }) {
    this.hide = ({ done, to }) => {
      smoothscroller.lock();
      asideController.destroy();
      r0 && r0.destroy();

      hide({
        context: this,
        done,
        to,
      });
    };

    this.show = ({ done, from }) => {
      window.scrollTo(0, 0);
      // init so that page components get initial values correctly
      smoothscroller.init();
      footer.init();
      nav.show();

      fx.destroy();

      if (Sniff.touchDevice && nav.state.mobileOpen) {
        nav.toggle();
      }

      show({
        context: this,
        from,
        done: () => {
          smoothscroller.resize();
          lazyloader.load();
          asideController.init();

          r0 = new Reveal({
            targets: ".rev",
            stagger: 75,
            auto: true,
          });

          fx.add();

          setTimeout(done, 0);
        },
      });
    };
  }
}
