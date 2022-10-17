import { iris, qs, qsa, Sniff } from "../../hermes";
import { FooterHover } from "./footerHover";

import { FooterSlider } from "./footerSlider";

import { Validator } from "../forms/manager";

export class Footer {
  constructor() {
    this.dom = qs("#footer");

    this.slider = new FooterSlider({ dom: this.dom });
    this.hover = new FooterHover({ dom: this.dom });

    this.form = qs("form", this.dom);

    this.common();
  }

  common = () => {
    iris.add(this.form, "submit", this.handleSubmit, { passive: false });

    this.unvalidate = qsa("input", this.form).map((input) =>
      iris.add(input, "input", this.handleValidate)
    );
  };

  init = () => {
    this.slider.init();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.running(this.form);

    const email = qs("#footer-email", this.form);
    const name = qs("#footer-name", this.form);
    const check = qs(
      Sniff.touchDevice ? "#footer-cta--check-m" : "#footer-cta--check-d",
      this.form
    );

    const isValid =
      Validator(name, this.setError, this.removeError) &&
      Validator(email, this.setError, this.removeError);

    if (!isValid) {
      this.resolved();
      return;
    }

    if (!check.checked) {
      alert("Please agree to the Privacy Policy and Terms of Service");
      this.resolved();
      return;
    }

    this.post(email.value, name.value);
  };

  handleValidate = (e) => {
    Validator(e.target, this.setError, this.removeError);
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

  running = (form = this.form) => {
    qs(".cta-btn", form).classList.add("running");
  };

  resolved = (form = this.form) => {
    qs(".cta-btn", form).classList.remove("running");
  };

  success = (form = this.form) => {
    this.setStatus("success", form);
  };

  failure = (form = this.form) => {
    this.setStatus("failure", form);
  };

  setStatus = (status, form) => {
    const isFailure = status === "failure";

    if (isFailure) {
      // handle failure
    } else {
      form.innerHTML = `
      <div id="footer-form--status" class="form-status df" style="flex-wrap: wrap; height: auto;">
      <svg fill="none" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="14" stroke="#022D42" stroke-width="2"/>
          <g clip-path="url(#z)">
              <path d="m21.532 9.912 1.056 1.072-9.779 9.928-5.221-5.3 1.055-1.072 4.166 4.23 8.723-8.858Z" fill="#022D42" stroke="#022D42" stroke-width=".5"/>
          </g>
          <defs>
              <clipPath id="z">
                  <path fill="#fff" transform="translate(5.088 4.912)" d="M0 0h20v20H0z"/>
              </clipPath>
          </defs>
      </svg>
      <div>Veuillez vérifier votre boîte de réception pour confirmer votre abonnement.</div>
      <small style="font-size: 12px; margin-top: 10px; line-height: 1.2;">
      Pour terminer le processus d'abonnement, il vous suffit de vérifier votre boîte de réception et de cliquer sur le lien figurant dans l'e-mail que nous venons de vous envoyer. S'il n'y figure pas, vérifiez votre dossier de courrier indésirable et, s'il s'y trouve, n'oubliez pas de marquer l'e-mail comme "non indésirable".
      </small>
    </div>
      `;
    }

    qs(".form-status", form).classList.add("active");
  };

  post = async (email, name) => {
    try {
      const res = await fetch("/.netlify/functions/form-handler", {
        method: "post",
        body: JSON.stringify({
          email,
          name,
        }),
      });

      // let data;
      if (res.ok) {
        // data = await res.json();
        this.success(this.form);
      } else {
        throw { status: res.status, statusText: res.statusText };
      }
    } catch (e) {
      // alert("For some reason, sending the request failed. Please try again.");
      this.success(this.form);
    }
  };
}

export const footer = new Footer();
