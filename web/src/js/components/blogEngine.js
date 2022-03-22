import { iris, qs, qsa } from "../hermes";
import { Search } from "./search";
import { Store } from "../store";

export class Engine {
  constructor() {
    this.state = {
      // search: null,
      filter: {
        active: "all",
        current: null,
      },
      page: {
        active: 1,
        current: null,
        items: [],
      },
      results: {
        current: [],
      },
    };

    this.settings = {
      count: 6,
      page: {
        container: qs("#pagination-list"),
        wrapper: qs("#pagination"),
        template: qs("#page-template"),
        item: ".pagination-item",
        arrows: {
          prev: qs("#pagination-before"),
          next: qs("#pagination-after"),
        },
      },
      filter: {
        container: qs("#filters-extended"),
        all: qs("#filters-extended--all"),
        tag: ".filter-tag",
      },
      search: {
        input: "#search-extended--input",
        template: "#blog-article--item",
        targetContainer: "#blog-article--list",
      },
    };

    this.search = new Search({
      ...this.settings.search,
      engine: this,
    });

    this.init();

    window.blog = this;
  }

  init = async () => {
    this.data = [];
    if (Store.articles) {
      this.data = Store.articles;
    } else {
      const res = await fetch("/static/article-data.json");
      const data = await res.json();
      // this.data = [...data, ...data, ...data, ...data];
      this.data = data;
      Store.articles = data;
    }

    this.readInitialState();

    this.buildPage();
    this.buildCategory();
    this.buildArrows();
  };

  updateUrlState = (params = this.params) => {
    window.history.replaceState({}, "", `${location.pathname}?${params}`);
  };

  readInitialState = () => {
    this.params = new URLSearchParams(window.location.search);

    const filter = this.params.get("filter")
      ? this.params.get("filter")
      : "all";

    if (filter) {
      this.state.filter.active = filter;
      qsa(this.settings.filter.tag, this.settings.filter.container).forEach(
        (item) => {
          if (item.innerText.toLowerCase() === filter.toLowerCase()) {
            item.classList.add("active");
            this.state.filter.current = item;
          }
        }
      );
      this.setFilter(filter);
    }
  };

  page = (i, arr = this.data) => {
    return arr.slice(i, i + this.settings.count);
  };

  filter = (category = "all", arr = this.data) => {
    this.params.set("filter", category.toLowerCase());
    this.updateUrlState();

    if (category === "all" || category === "ALL") {
      return arr;
    } else {
      return arr.filter(
        (item) => item.postCategory.toLowerCase() === category.toLowerCase()
      );
    }
  };

  buildArrows = () => {
    iris.add(this.settings.page.arrows.prev, "click", () => {
      this.handlePageClick({
        target: this.state.page.items[this.state.page.active - 1],
      });
    });

    iris.add(this.settings.page.arrows.next, "click", () => {
      this.handlePageClick({
        target: this.state.page.items[this.state.page.active + 1],
      });
    });
  };

  buildPage = (arr = this.data) => {
    const nPages = Math.ceil(arr.length / this.settings.count);
    const template = this.settings.page.template;

    this.state.page.items = [];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < nPages; i++) {
      const clone = template.content.cloneNode(true);
      const item = qs(this.settings.page.item, clone);
      item.innerText = i + 1;
      iris.add(item, "click", this.handlePageClick);

      if (i === 0) {
        this.state.page.current = item;
        this.state.page.current.classList.add("active");
        this.setPage(this.state.page.current, 0);
        this.settings.page.arrows?.prev.classList.add("inactive");
      }

      if (nPages === 1) {
        this.settings.page.arrows?.next.classList.add("inactive");
      }

      frag.append(clone);
    }

    this.settings.page.container.innerHTML = null;
    this.settings.page.container.appendChild(frag);
    this.state.page.items = qsa(
      this.settings.page.item,
      this.settings.page.container
    );
  };

  handlePageClick = (e) => {
    const val = parseInt(e.target.innerText);
    this.state.page.active = val - 1;
    this.search.clearInput();

    this.setPage(e.target, val);

    const results = this.page(val);
    this.search.build(results);
  };

  setPage = (target, idx) => {
    this.state.page.current.classList.remove("active");

    if (!target) {
      targets = this.state.page.items[idx];
    }

    this.state.page.current = target;
    target.classList.add("active");

    if (idx === 1) {
      // first entry
      this.settings.page.arrows?.prev.classList.add("inactive");
    } else {
      this.settings.page.arrows?.prev.classList.remove("inactive");
    }

    const nPages = Math.ceil(
      this.state.results.current.length / this.settings.count
    );

    if (idx === nPages + 1) {
      this.settings.page.arrows?.next.classList.add("inactive");
    } else {
      this.settings.page.arrows?.next.classList.remove("inactive");
    }
  };

  buildCategory = () => {
    iris.add(
      qsa(this.settings.filter.tag, this.settings.filter.container),
      "click",
      this.handleFilterClick
    );
    this.state.filter.current = qs(
      `${this.settings.filter.tag}.active`,
      this.settings.filter.container
    );
  };

  handleFilterClick = (e) => {
    this.setFilterItem(e.target);

    const val = e.target.innerText;
    this.state.filter.active = val;

    this.setFilter(val);
  };

  setFilter = (val) => {
    this.search.clearInput();

    const filtered = this.filter(val);
    this.buildPage(filtered);
    const paged = this.page(0, filtered);

    this.search.build(paged);
  };

  setFilterItem = (target) => {
    this.state.filter.current.classList.remove("active");
    this.state.filter.current = target;
    target.classList.add("active");
  };

  destroy = () => {
    this.search.destroy();
  };
}
