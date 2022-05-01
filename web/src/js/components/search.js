import { iris, qs, qsa, Sniff, Vau } from "../hermes";
import { app } from "../main";

export const trimText = (text, charCount = 160, addEllipsis = true) => {
  if (text.length > charCount) {
    return addEllipsis
      ? text.slice(0, charCount) + "..."
      : text.slice(0, charCount);
  } else {
    return text;
  }
};

export class Search {
  constructor({ input, template, targetContainer, btn, noResults, engine }) {
    this.input = qs(input);
    this.template = qs(template);
    this.targetContainer = qs(targetContainer);
    this.btn = qs(btn);
    this.noResult = qs(noResults);
    this.engine = engine;

    this.active = false;

    // this.api = "/.netlify/functions/search?term=";
    this.api = "https://depoly.netlify.app/.netlify/functions/search?term=";

    this.listen();
  }

  listen = () => {
    this.unClick = iris.add(this.input, "keydown", this.handleInput);

    if (Sniff.touchDevice) {
      this.unPress = iris.add(this.btn, "click", this.handleMobile);
      this.unBlur = iris.add(
        "#search-extended--close",
        "click",
        this.handleMobileClose
      );
    } else {
      this.unPress = iris.add(this.btn, "click", this.handleInput);
    }
  };

  handleInput = (e) => {
    if (e.type === "keydown" && e.key !== "Enter") return;

    const val = this.input.value.trim().toLowerCase();
    if (!val || val === this.engine.params.get("search")) return;

    this.engine.params.set("search", val);
    this.engine.updateUrlState();

    try {
      this.query(val);
    } catch (e) {
      console.log(e);
    }
  };

  handleMobile = (e) => {
    // hide filters layer
    if (this.active) {
      this.handleInput({ key: "Enter" });
      return;
    }
    const filters = qs("#filters-extended");
    filters.style.pointerEvents = "none";
    filters.style.opacity = 0;

    this.input.focus();
    // set search active
    this.active = true;
  };

  handleMobileClose = () => {
    this.input.blur();

    const filters = qs("#filters-extended");
    filters.style.pointerEvents = "all";
    filters.style.opacity = 1;

    this.active = false;
  };

  clearInput = () => {
    this.input.value = "";
    this.engine.params.delete("search");
    this.engine.updateUrlState();
  };

  query = async (str) => {
    const searchRequest = await fetch(`${this.api}${str}`);
    const results = await searchRequest.json();

    if (results.length) {
      // limit to 6 to prevent pagination
      const filtered = this.engine.filter(
        this.engine.state.filter.active,
        results
      );

      if (!filtered.length) {
        this.noResults();
        return;
      }

      this.engine.state.results.current = filtered;

      const paged = this.engine.page(1, filtered);

      this.engine.buildPage(paged);

      this.build(paged);
    } else {
      this.noResults();
    }
  };

  build = (arr) => {
    if (!this.targetContainer) return;

    if (!arr.length) {
      this.noResults();
      return;
    }

    const frag = document.createDocumentFragment();
    arr.map((item) => {
      const clone = this.template.content.cloneNode(true);
      qs("a", clone).href = `/article/${item.url}/`;
      qs("img", clone).src = item.mainImage;
      qs("img", clone).alt = trimText(item.title, 40);
      qs(".article-card--title", clone).innerHTML = trimText(item.title, 40);
      qs(".article-card--desc", clone).innerHTML = trimText(item.content, 160);
      qs(
        ".article-card--tag",
        clone
      ).innerText = `${item.postCategory} / ${item.date}`;

      frag.appendChild(clone);
    });

    this.targetContainer.style.display = "grid";
    this.noResult.style.position = "absolute";
    this.noResult.style.opacity = 0;
    this.noResult.style.pointerEvents = "none";

    new Vau({
      targets: qsa(".article-card", this.targetContainer),
      opacity: [1, 0],
      duration: 300,
      easing: "i4",
      complete: () => {
        this.targetContainer.innerHTML = null;
        this.targetContainer.appendChild(frag);
        app.listeners();

        new Vau({
          targets: qsa(".article-card", this.targetContainer),
          opacity: [0, 1],
          duration: 1200,
          easing: "o6",
        });
      },
    });
  };

  noResults = () => {
    this.targetContainer.style.display = "none";
    app.listeners();

    this.noResult.style.position = "static";
    this.noResult.style.opacity = 1;
    this.noResult.style.pointerEvents = "all";
    this.engine.buildPage([]);
  };

  destroy = () => {
    this.unClick && this.unClick();
    this.unPress && this.unPress();
    this.unBlur && this.unBlur();
  };
}
