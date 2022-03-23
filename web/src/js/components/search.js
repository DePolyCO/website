import { iris, qs, qsa, Vau } from "../hermes";
import { app } from "../main";

const trimText = (text, charCount = 160, addEllipsis = true) => {
  if (text.length > charCount) {
    return addEllipsis
      ? text.slice(0, charCount) + "..."
      : text.slice(0, charCount);
  } else {
    return text;
  }
};

export class Search {
  constructor({ input, template, targetContainer, engine }) {
    this.input = qs(input);
    this.template = qs(template);
    this.targetContainer = qs(targetContainer);
    this.engine = engine;

    // this.api = "/.netlify/functions/search?term=";
    this.api = "https://depoly.netlify.app/.netlify/functions/search?term=";

    this.listen();
  }

  listen = () => {
    this.unClick = iris.add(this.input, "keydown", this.handleInput);
  };

  handleInput = (e) => {
    if (e.key !== "Enter") return;
    const val = e.target.value.trim();
    if (!val) return;

    this.engine.params.set("search", val.toLowerCase());
    this.engine.updateUrlState();

    try {
      this.query(val);
    } catch (e) {
      console.log(e);
    }
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
      this.engine.state.results.current = filtered;

      const paged = this.engine.page(1, filtered);

      this.engine.buildPage(paged);

      this.build(paged);
    } else {
      console.log("No results!");
    }
  };

  build = (arr) => {
    if (!this.targetContainer) return;
    const frag = document.createDocumentFragment();
    arr.map((item) => {
      const clone = this.template.content.cloneNode(true);
      qs("a", clone).href = `/article/${item.url}/`;
      qs("img", clone).src = item.mainImage;
      qs(".article-card--title", clone).innerText = trimText(item.title, 40);
      qs(".article-card--desc", clone).innerText = trimText(item.content, 160);
      qs(
        ".article-card--tag",
        clone
      ).innerText = `${item.postCategory} / ${item.date}`;

      frag.appendChild(clone);
    });

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

  destroy = () => {
    this.unClick && this.unClick();
  };
}
