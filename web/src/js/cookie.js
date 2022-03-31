import { qs, iris, Duration } from "./hermes";
import { Store } from "./store";

export class Cookie {
  constructor() {
    new Duration({
      duration: 3000,
      complete: this.init,
    });
  }

  init = () => {
    this.dom = qs("#cookie-banner");
    this.listen();

    this.dom.classList.add("on");
  };

  listen = () => {
    this.unAccept = iris.add("#cookie-accept", "click", this.accept);
    this.unDecline = iris.add("#cookie-decline", "click", this.decline);
  };

  accept = () => {
    this.dom.classList.remove("on");

    // load analytics
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-6G46PSYF8Z");

    Store.cookie = true;

    this.destroy();
  };

  decline = () => {
    this.dom.classList.remove("on");
    this.destroy();
  };

  destroy = () => {
    this.unAccept();
    this.unDecline();
    this.dom = null;
  };
}
