const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

const htm = require("htm");
const vhtml = require("vhtml");
const { toHTML, uriLooksSafe } = require("@portabletext/to-html");

const html = htm.bind(vhtml);

const postComponents = {
  types: {
    Break: () => {
      return html`<div data-scroll-section><hr /></div>`;
    },
  },

  marks: {
    link: ({ children, value }) => {
      const href = value.href || "";

      if (uriLooksSafe(href)) {
        const rel = href.startsWith("/") ? undefined : "noreferrer noopener";
        const target = href.startsWith("/") ? undefined : "_blank";
        return html`<a
          class="text-underline"
          href="${href}"
          rel="${rel}"
          target="${target}"
          >${children}</a
        >`;
      }

      return children;
    },
  },

  list: {
    number: ({ children }) =>
      `<section data-scroll-section><ol>${children}</ol></section>`,
    bullet: ({ children }) =>
      `<section data-scroll-section><ul>${children}</ul></section>`,
  },

  block: {
    normal: ({ children }) => {
      if (!children.length) return `<br />`;
      return `<section data-scroll-section><p>${children}</p></section>`;
    },
    h2: ({ children }) =>
      html`<section data-scroll-section><h2>${children}</h2></section>`,
  },
};

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

module.exports = withCache(
  async () => {
    const policy = await client.fetch(groq`*[_type == 'privacy']{
        _updatedAt,
        body
      }[0]
    `);

    policy._updatedAt = dateTimeFormat.format(new Date(policy._updatedAt));

    return {
      ...policy,
      _updatedAt: dateTimeFormat.format(new Date(policy._updatedAt)),
      body: toHTML(policy.body, { components: postComponents }),
    };
  },
  "privacy",
  "1d"
);
