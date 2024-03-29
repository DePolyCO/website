const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

const htm = require("htm");
const vhtml = require("vhtml");
const { toHTML, uriLooksSafe } = require("@portabletext/to-html");

const html = htm.bind(vhtml);

const youtubeID = require("../../../utils/get-video-id");

const htmlEntities = require("html-entities");

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
          >${htmlEntities.decode(children)}</a
        >`;
      }

      return children;
    },
  },

  list: {
    number: ({ children }) =>
      `<section data-scroll-section><ol class="fv-mono">${htmlEntities.decode(children)}</ol></section>`,
    bullet: ({ children }) =>
      `<section data-scroll-section><ul class="fv-mono">${htmlEntities.decode(children)}</ul></section>`,
  },

  block: {
    normal: ({ children }) => {
      if (!children.length) return `<br />`;
      return `<section data-scroll-section><p>${htmlEntities.decode(children)}</p></section>`;
    },
    h2: ({ children }) =>
      html`<section data-scroll-section><h2>${htmlEntities.decode(children)}</h2></section>`,
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
          <p data-tweet-target>${htmlEntities.decode(children)}</p>
        </blockquote>
      </section>`,
  },
};

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

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

    const langPosts = [...articles, featured]
      .filter((item) => item.__i18n_lang === "en")
      .map((post, idx, arr) => {
        return {
          ...post,
          body: toHTML(post.body, { components: postComponents }),
          publishedAt: dateTimeFormat.format(
            new Date(post.settings.publishedAt)
          ),
          related: arr.filter((item) => item._id !== post._id).slice(0, 3),
        };
      });

    const buckets = { all: [] };
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
  "articles",
  "1d"
);
