import { qs, iris, Duration } from "./hermes";

export class Cookie {
  constructor() {
    const choice = localStorage.getItem("cookieChoice");
    if (choice && choice.length) {
      if (choice === "true") {
        this.startAnalytics();
      }
      return;
    }

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

    this.startAnalytics();

    localStorage.setItem("cookieChoice", true);

    this.destroy();
  };

  startAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-9KSCSKLDB5");
  };

  decline = () => {
    this.dom.classList.remove("on");
    localStorage.setItem("cookieChoice", false);
    this.destroy();
  };

  destroy = () => {
    this.unAccept && this.unAccept();
    this.unDecline && this.unDecline();
    this.dom = null;
  };
}
