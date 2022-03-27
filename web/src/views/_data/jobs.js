const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const jobs = await client.fetch(groq`*[_type == 'jobs']{
      ...,
    }
    `);

    const filtered = jobs
      .filter((item) => item.__i18n_lang === "en")
      .map((item) => {
        item.levels = Object.keys(item.level)
          .filter((key) => item.level[key])
          .join("/");

        return item;
      });

    return filtered;
  },
  "jobs",
  "1d"
);
