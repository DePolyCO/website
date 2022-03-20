import { iris, qs, qsa, Vau } from "../hermes";
import { app } from "../main";

export class Search {
  constructor({ input, template, targetContainer }) {
    this.input = qs(input);
    this.template = qs(template);
    this.targetContainer = qs(targetContainer);

    this.api = "/.netlify/functions/search?term=";

    this.listen();
  }

  listen = () => {
    this.unClick = iris.add(this.input, "keydown", this.handleInput);
  };

  handleInput = (e) => {
    if (e.key !== "Enter") return;
    const val = e.target.value.trim();
    if (!val) return;

    try {
      this.query(val);
    } catch (e) {
      console.log(e);
    }
  };

  query = async (str) => {
    const searchRequest = await fetch(`${this.api}${str}`);
    const results = await searchRequest.json();

    if (!results.length) {
      console.log("No results!");
      return;
    } else {
      this.build(results);
    }
  };

  build = (arr) => {
    if (!this.targetContainer) return;
    const frag = document.createDocumentFragment();
    arr.map((item) => {
      const clone = this.template.content.cloneNode(true);
      qs("a", clone).href = `/article/${item.url}/`;
      qs("img", clone).src = item.mainImage;
      qs(".article-card--title", clone).innerText = item.title.slice(0, 40);
      qs(".article-card--desc", clone).innerText = item.content.slice(0, 160);

      frag.appendChild(clone);
    });
    this.targetContainer.innerHTML = null;
    this.targetContainer.appendChild(frag);

    app.listeners();

    new Vau({
      targets: qsa(".article-card", this.targetContainer),
      opacity: [0, 1],
      duration: 400,
    });
  };

  destroy = () => {
    this.unClick && this.unClick();
  };
}
