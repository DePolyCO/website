const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

const htm = require("htm");
const vhtml = require("vhtml");
const { toHTML, uriLooksSafe } = require("@portabletext/to-html");

const html = htm.bind(vhtml);

const youtubeID = require("../../../utils/get-video-id");

const postComponents = {
  types: {
    image: ({ value }) => {
      if (!value.asset) return ``;

      const { metadata = {}, url } = value.asset;
      const { lqip = false, dimensions = { width: 1800, height: 1800 } } =
        metadata;

      return `<section class="no-contain" data-scroll-section>
      <figure class="pr">
        <picture
          style="--w:${dimensions.width}; --h:${dimensions.height};">
          <img src="${lqip ? lqip : ""}" data-lazy-src="${url}"
          alt="${value.alt}" />
        </picture>
        <figcaption>${value.alt}</figcaption>
      </figure>
    </section>`;
    },

    youtube: ({ value }) => {
      const videoID = youtubeID(value.url);
      return `
      <section class="yt-video cp pr" data-scroll-section>
      <iframe
          id="_yt-${videoID}"
          width="560" 
          height="315" 
          src="https://www.youtube-nocookie.com/embed/${videoID}?enablejsapi=1&amp;controls=0&amp;modestbranding=1;rel=0" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen></iframe>
      <div class="yt-video--overlay video-overlay pa pen top left right bottom"></div>
  </section>
      `;
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
      `<section data-scroll-section><ol class="fv-mono">${children}</ol></section>`,
    bullet: ({ children }) =>
      `<section data-scroll-section><ul class="fv-mono">${children}</ul></section>`,
  },

  block: {
    normal: ({ children }) => {
      if (!children.length) return `<br />`;
      return `<section data-scroll-section><p>${children}</p></section>`;
    },
    h4: ({ children }) =>
      html`<section data-scroll-section><h2>${children}</h2></section>`,
    blockquote: ({ children }) =>
      html`<section data-scroll-section>
        <blockquote data-tweet-parent>
          <div class="blockquote-tag df aic">
            <div class="blockquote-icon">
              <svg>
                <use xlink:href="#apostrophe"></use>
              </svg>
            </div>
            <a
              data-tweet-trigger
              href=""
              target="_blank"
              rel="noreferrer noopener"
              class="tweet-icon df aic cp"
            >
              <svg>
                <use xlink:href="#tweet-icon"></use>
              </svg>
              <div class="fv-mono ttu">Tweet this quote</div>
            </a>
          </div>
          <p data-tweet-target>${children}</p>
        </blockquote>
      </section>`,
  },
};

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const articleDataToItem = (post, arr) => {
  return {
    ...post,
    body: toHTML(post.body, { components: postComponents }),
    publishedAt: dateTimeFormat.format(new Date(post.settings.publishedAt)),
    related: arr.filter((item) => item._id !== post._id).slice(0, 3),
  };
};

module.exports = withCache(
  async () => {
    const articles =
      await client.fetch(groq`*[_type == 'post' && _id != *[_type == 'featuredPost'][0].featured->_id &&  settings.publishedAt < now()]{
      ...,
      body[]{
        ...,
        asset->{..., url}
      },
      settings {
        ...,
        "postCategory":postCategory->title
      }
    } | order(settings.publishedAt desc)
    `);

    const featured = await client.fetch(groq`*[_type == 'featuredPost']{
      featured->{
        ...,
        body[]{
          ...,
          asset->{..., url}
        },
        settings {
          ...,
          "postCategory":postCategory->title
        }
      }
    }[0].featured
  `);

    const langPosts = articles
      .filter((item) => item.__i18n_lang === "en")
      .map((post, idx, arr) => {
        // translation exists
        if (post.__i18n_refs && post.__i18n_refs[0]) {
          const translation = articles.filter(
            (item) => item._id === post.__i18n_refs[0]._ref
          );
          return articleDataToItem(translation[0], arr);
        }
        return articleDataToItem(post, arr);
      });

    const buckets = { all: [featured] };
    langPosts.forEach((post) => {
      if (buckets[post.settings.postCategory]) {
        buckets[post.settings.postCategory].push(post);
      } else {
        buckets[post.settings.postCategory] = [post];
      }
      buckets.all.push(post);
    });

    return buckets;
  },
  "articles-fra",
  "1d"
);
