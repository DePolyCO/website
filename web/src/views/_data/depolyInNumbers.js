const withCache = require("../../../utils/cache");
const client = require("../../../utils/sanityClient");
const groq = require("groq");

module.exports = withCache(async () => {
  return (
    await client.fetch(
      groq`
      *[_type == "depolyInNumbers"][0] {
        employees,
        nationalities,
        genderRatio,
        languages,
        yearsOfExperience
      }
    `
    )
  );
}, "depolyInNumbers");