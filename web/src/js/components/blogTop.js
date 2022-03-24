import { iris, qs, qsa, Vau } from "../hermes";
import { Search, trimText } from "./search";
import { app } from "../main";

export class MiniBlog {
  constructor({ engine }) {
    this.engine = engine;

    this.state = {
      filters: {
        active: "all",
        current: qs("#filter-all"),
      },
    };

    this.settings = {
      filters: {
        container: qs("#filters-container"),
        tags: qsa(".filter-category"),
        all: qs("#filter-all"),
      },
      results: {
        template: qs("#blog-category--item"),
        container: qs("#blog-category--list"),
      },
    };

    this.init();
  }

  init = () => {
    this.readIntialState();
    this.listen();
  };

  readIntialState = () => {
    const filter = this.engine.state.filter.active;
    this.settings.filters.tags.forEach((item) => {
      if (item.innerText.toLowerCase() === filter.toLowerCase()) {
        item.classList.add("active");
        this.state.filters.current = item;
      }
    });

    this.setFilter(filter);
  };

  listen = () => {
    this.unclick = iris.add(
      this.settings.filters.tags,
      "click",
      this.handleFilterClick
    );
  };

  handleFilterClick = (e) => {
    e.target.classList.add("active");
    this.state.filters.current.classList.remove("active");
    this.state.filters.current = e.target;
    const val = e.target.innerText.trim().toLowerCase();

    this.setFilter(val);
  };

  setFilter = (val) => {
    const filtered = this.filter(val, this.engine.data);
    const results = this.page(filtered);

    this.build(results);
  };

  filter = (filter = "all", arr = this.data) => {
    return this.engine.filter(filter, arr);
  };

  page = (arr = this.data) => {
    return arr.slice(0, 3);
  };

  build = (arr = this.data) => {
    const { container, template } = this.settings.results;

    const frag = document.createDocumentFragment();
    arr.map((item) => {
      const clone = template.content.cloneNode(true);
      qs("a", clone).href = `/article/${item.url}/`;
      qs("img", clone).src = item.mainImage;
      qs(".article-card--title", clone).innerHTML = trimText(item.title, 40);
      qs(".article-card--desc", clone).innerHTML = trimText(item.content, 160);
      qs(
        ".article-card--tag",
        clone
      ).innerText = `${item.postCategory} / ${item.date}`;

      frag.appendChild(clone);
    });

    new Vau({
      targets: qsa(".article-card", container),
      opacity: [1, 0],
      duration: 300,
      easing: "i4",
      complete: () => {
        container.innerHTML = null;
        container.appendChild(frag);
        app.listeners();

        new Vau({
          targets: qsa(".article-card", container),
          opacity: [0, 1],
          duration: 1200,
          easing: "o6",
        });
      },
    });
  };

  destroy = () => {
    this.unclick();
  };
}
