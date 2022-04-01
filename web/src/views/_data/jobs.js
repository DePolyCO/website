const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const jobs = await client.fetch(groq`*[_type == 'jobs' && active]{
      ...,
    }
    `);

    jobs.forEach((item) => {
      item.levels = Object.keys(item.level)
        .filter((key) => item.level[key])
        .join("/");
    });

    const filtered = jobs
      .filter((item) => item.__i18n_lang === "en")
      .map((item) => {
        if (item.__i18n_refs && item.__i18n_refs[0]) {
          return jobs.filter((job) => job._id === item.__i18n_refs[0]._ref)[0];
        }
        return item;
      });

    return filtered;
  },
  "jobs-fra",
  "1d"
);
