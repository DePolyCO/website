import { iris, bindAll, Conductor } from "../hermes";

//
// listen to route change events and react to them
// update route based on logic
//

class Router extends Conductor {
  constructor() {
    super();

    bindAll(this, ["handlePop"]);

    this.state = {
      lastRoute: null,
      route: location.href,
      pop: false,
    };

    this.listen();
  }

  //   add event listeners
  listen() {
    iris.add(window, "popstate", this.handlePop, {
      passive: false,
    });
  }

  //   use browser to change route
  handlePop(e) {
    e.stopPropagation();
    e.preventDefault();

    this.state.url = location.href;
    this.state.pop = true;

    // handle state change
    this.execute();
  }

  //   manually trigger route change
  goto(url) {
    // set old route
    this.state.lastRoute = this.state.route;
    // update browser url
    history.pushState({ page: url }, "", url);
    // update new state
    this.state.route = url;

    // execute callbacks
    this.execute();
  }

  //   queue and execute callbacks
  execute() {
    this.train.forEach((item) => item(this.state));

    // reset pop state
    this.state.pop = false;
  }
}

export const router = new Router();
