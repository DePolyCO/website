import { qs, qsa, iris, Conductor } from "../hermes";

export class Select extends Conductor {
  constructor({
    dom = "#langs-select",
    options = "li",
    active = "#lang-active",
    callback,
  } = {}) {
    super();

    this.dom = qs(dom);
    this.options = qsa(options, this.dom);
    this.active = qs(active, this.dom);
    this.value = this.active.dataset.value;

    this.isOpen = false;
    this.callback = callback;

    this.listen();
  }

  listen = () => {
    this.unclickToggle = iris.add(this.dom, "click", this.toggle);
    this.unclickOptions = iris.add(this.options, "click", this.click);
  };

  toggle = () => {
    this.isOpen = !this.isOpen;
    this.dom.classList.toggle("active");
  };

  click = (e) => {
    const oldActive = this.active.innerText;
    const oldValue = this.value;

    const newNode = e.target;

    this.active.innerText = newNode.innerText;
    this.value = newNode.dataset.value;

    newNode.innerText = oldActive;
    newNode.dataset.value = oldValue;

    this.callback && this.callback(this.value, this.isOpen);
  };

  setActiveValue = (value) => {
    if (value === this.value) return;
    this.click({ target: qs(`[data-value="${value}"]`, this.dom) });
  };

  destroy() {
    this.unclickToggle();
    this.unclickOptions();
  }
}
