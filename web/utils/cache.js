const { AssetCache } = require("@11ty/eleventy-cache-assets");
require("dotenv").config();

const useCache = process.env.PRODUCTION === "false";

if (useCache) {
  console.log(`[Building with cache]`);
} else {
  console.log(`[Not using cache]`);
}

const withCache = async (fn, name, duration = "1d") => {
  const asset = new AssetCache(name);

  if (useCache) {
    if (asset.isCacheValid(duration)) {
      return asset.getCachedValue();
    }
  }

  const data = await fn();
  await asset.save(data, "json");

  return data;
};

module.exports = withCache;
