import { iris, qs, Throttle } from "../hermes";

export class Search {
  constructor() {
    this.dom = qs("#search");
    this.api = "https://depoly.netlify.app/.netlify/functions/search";

    this.listen();
  }

  listen = () => {
    iris.add(this.dom, "input", this.handleInput);
  };

  handleInput = (e) => {
    const val = e.target.value.trim();
    if (!val) return;

    console.log(`search for ${val}`);
  };

  query = async (str) => {
    let searchRequest = await fetch(`/api/search?term=${str}`);
    let results = await searchRequest.json();

    if (!results.length) {
      console.log("No results!");
      return;
    } else {
      console.log(results);
    }
  };
}
