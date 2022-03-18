const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

module.exports = withCache(
  async () => {
    const jobs = await client.fetch(groq`*[_type == 'jobs']{
      ...,
    }
    `);

    return jobs.filter((item) => item.__i18n_lang === "en");
  },
  "jobs",
  "1d"
);
