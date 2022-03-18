import { bounds, iris, qs, qsa, Sniff } from "../hermes";
import { smoothscroller } from "../scroller";

export class Tweeter {
  constructor() {
    this.init();

    const dom = qs("#share-btn");
    if (Sniff.touchDevice) {
      dom.remove();
      return;
    }

    this.dom = dom;
    this.active = false;
    this.listen();
  }

  init = () => {
    const triggers = qsa(`[data-tweet-trigger]`);
    triggers
      .map((item) => item.closest(`[data-tweet-parent]`))
      .map((item) => qs(`[data-tweet-target]`, item).innerText)
      .forEach((item, i) => {
        triggers[i].href = this.getTweetURL(item);
      });
  };

  listen = () => {
    this.unUp = iris.add(document, iris.events.up, this.handleSelection);
    this.unClick = iris.add(document, "click", this.removeSelection);
    this.scrollID = smoothscroller.add({
      update: ({ deltaY }) => {
        if (this.active && deltaY > 15) {
          this.clearSelection();
          this.removeButton();
          this.active = false;
        }
      },
    });
  };

  handleSelection = () => {
    const selection = this.getSelection;
    const text = this.getSelectedText(selection);
    if (text !== "") {
      this.placeButton(selection);
    }
  };

  removeSelection = (e) => {
    const text = this.getSelectedText();
    if (text !== "") {
      e.stopPropagation();
    } else {
      this.removeButton();
    }
  };

  placeButton = (selection) => {
    const rect = bounds(selection.getRangeAt(0));
    const dims = bounds(this.dom);

    this.dom.style.top = `${rect.top - dims.height * 1.8}px`;
    this.dom.style.left = `${Math.max(
      rect.left + rect.width / 2 - dims.width / 2,
      0
    )}px`;

    this.dom.style.opacity = 1;
    this.dom.style.pointerEvents = "all";

    this.dom.href = this.getTweetURL(this.getSelectedText());

    this.active = true;
  };

  removeButton = () => {
    this.dom.style.opacity = 0;
    this.dom.style.pointerEvents = "none";
    this.active = false;
  };

  getSelectedText = (selection = this.getSelection) => {
    if (window.getSelection) {
      return selection.toString();
    } else if (document.selection) {
      return selection.text;
    }
    return "";
  };

  clearSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      document.selection.empty();
    }
  };

  get getSelection() {
    if (window.getSelection) {
      return window.getSelection();
    } else if (document.selection) {
      return document.selection.createRange();
    }
    return "";
  }

  getTweetURL = (text, extra = "", via = "https://depoly.co") => {
    let url = "https://twitter.com/intent/tweet?text=";
    // trim the text to fit in the max allowed 280 characters
    const viaUrl = `&via=${via}`;
    const maxLength = 280;
    const maxAllowedLength = maxLength - viaUrl.length - extra.length;
    let textToTweet = text;
    if (text.length > maxAllowedLength) {
      textToTweet = text.substring(0, maxAllowedLength - 1);
    }
    url += encodeURIComponent(textToTweet);
    if (extra) url += encodeURIComponent(" " + extra);

    if (via) url += viaUrl;

    return url;
  };

  destroy = () => {
    if (Sniff.touchDevice) return;
    this.unClick();
    this.unUp();
    smoothscroller.remove(this.scrollID);
  };
}
