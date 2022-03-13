import { iris, qs, qsa } from "../../hermes";

const regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  name: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
};

const validate = {
  empty: (str) => {
    return str.length === 0;
  },
  name: (str) => {
    return str.match(regex.name);
  },
  email: (str) => {
    return str.match(regex.email);
  },
  url: (str) => {
    return str.match(regex.url);
  },
};

const humanFileSize = (bytes, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024;
  const humanUnits = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < humanUnits.length - 1
  );

  return bytes.toFixed(dp) + " " + humanUnits[u];
};

export class FormManager {
  constructor({ root = "main" } = {}) {
    this.config = {
      // url: "https://depoly.netlify.app",
      url: "",
      route: "/",
      text: {
        success: {
          bg: " #F2FFBD",
          icon: "#tick-icon",
          title: "Thank you,",
          desc: "Your message is sent sucessfully and it will be answered soon",
        },
        failure: {
          bg: "#FF6666",
          icon: "#cross-icon",
          title: "Something went wrong",
          desc: "For some reason, sending the message failed. Please <button type='button' class='retry link link-dark link-solid'> try again</button>.",
        },
      },
    };
    this.forms = qsa("form", qs(root));
    this.inputs = this.forms.map((form) => qsa("input", form));
    this.listen();
  }

  listen = () => {
    this.unlisten = iris.add(this.forms, "submit", this.handleSubmit, {
      passive: false,
    });

    this.unvalidate = [];
    this.unfile = [];

    this.inputs.map((inputs) => {
      inputs.forEach((input) => {
        if (input.type !== "file") {
          this.unvalidate.push(iris.add(input, "input", this.handleValidate));
        }
      });
    });

    this.inputs.map((inputs) => {
      inputs.forEach((input) => {
        if (input.type === "file") {
          this.unfile.push(iris.add(input, "change", this.handleFile));
        }
      });
    });

    iris.add(".form-wrapper summary", "pointerenter", (e) =>
      e.target.parentNode.parentNode.classList.toggle("hover-toggle")
    );
    iris.add(".form-wrapper summary", "pointerleave", (e) =>
      e.target.parentNode.parentNode.classList.toggle("hover-toggle")
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const inputs = [...form.elements].filter((tag) =>
      ["select", "textarea", "input"].includes(tag.tagName.toLowerCase())
    );

    let hasError = false;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const isValid = this.validate(input);

      if (!isValid) {
        hasError = true;
      }
    }

    if (hasError) return;

    this.post(form);
  };

  handleFile = (e) => {
    const input = e.target;
    const parent = input.closest(".field");
    const labelWrapper = qs(".field-label--file-inner", parent);
    const label = qs(".field-label--filename", labelWrapper);

    const { name, size } = e.target.files[0];
    label.innerText = name + ` (${humanFileSize(size)})`;
    labelWrapper.classList.add("active");
  };

  post = async (form) => {
    this.running(form);
    const formData = new FormData(form);
    try {
      const res = await fetch(`${this.config.url}${this.config.route}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        this.success(form);
      } else {
        throw { status: res.status, statusText: res.statusText };
      }
    } catch (e) {
      this.failure(form);
    } finally {
      this.resolved(form);
    }
  };

  running = (form) => {
    qs(".cta-btn", form).classList.add("running");
  };

  resolved = (form) => {
    qs(".cta-btn", form).classList.remove("running");
  };

  success = (form) => {
    // console.log("submitted");
    this.setStatus("success", form);
  };

  failure = (form) => {
    // console.log("failed");
    this.setStatus("failure", form);
  };

  handleValidate = (e) => {
    this.validate(e.target);
  };

  validate = (node) => {
    const { value, dataset, required } = node;
    const { type } = dataset;
    const parent = node.parentNode;

    if (validate.empty(value)) {
      if (required) {
        this.setError(parent, "empty");
        return false;
      }
    } else if (type === "email" && !validate.email(value)) {
      this.setError(parent, "email");
      return false;
    } else if (type === "name" && !validate.name(value)) {
      this.setError(parent, "name");
      return false;
    } else if (type === "url" && !validate.url(value)) {
      this.setError(parent, "url");
      return false;
    }

    this.removeError(parent);
    return true;
  };

  hasError = (node) => {
    return node.classList.contains("err");
  };

  setError = (node, err) => {
    if (!this.hasError(node)) {
      node.classList.add("err");
      node.dataset.error = err;
    }
  };

  removeError = (node) => {
    if (this.hasError(node)) {
      node.classList.remove("err");
    }
  };

  setStatus = (status, form) => {
    const wrapper = form.closest(".form-wrapper");
    const panel = qs(".form-status", wrapper);
    const isFailure = status === "failure";

    const txt = this.config.text[status];

    qs(".form-status--tick", panel).style.backgroundColor = txt.bg;
    qs("svg use", panel).setAttribute("href", txt.icon);
    qs(".form-status--thank", panel).innerText = isFailure
      ? txt.title
      : txt.title + " " + qs(".first-name", form).value;
    qs(".form-status--desc", panel).innerHTML = txt.desc;

    if (isFailure) {
      iris.add(qs(".retry"), "click", () => this.removeStatus(form), {
        once: true,
      });
    }

    panel.classList.add("active");
  };

  removeStatus = (form) => {
    const wrapper = form.closest(".form-wrapper");
    const panel = qs(".form-status", wrapper);

    panel.classList.remove("active");
  };

  destroy = () => {
    this.unlisten();
    this.unvalidate.forEach((e) => e());
    this.unfile.forEach((e) => e());
  };
}
