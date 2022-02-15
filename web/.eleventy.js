const htmlmin = require("html-minifier");

const urlFor = require("./utils/imageUrl");
const buildFileUrl = require("./utils/fileUrl");

const string = require("string");
const fs = require("fs");

require("dotenv").config();

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("static");

  eleventyConfig.addWatchTarget("./src/js/");
  eleventyConfig.setBrowserSyncConfig({
    ghostMode: false,
    injectChanges: true,
    files: ["./dist/css/*.css"],
    callbacks: {
      ready: (err, bs) => {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("dist/404.html");
          // Add 404 http status code in request header.
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  eleventyConfig.addNunjucksShortcode("imageUrlFor", (image) => {
    return urlFor(image).maxWidth(2500).fit("max").auto("format");
  });

  eleventyConfig.addNunjucksShortcode("fileUrlFor", (file) => {
    return buildFileUrl(file);
  });

  eleventyConfig.addFilter("slugify", (input) => {
    if (!input) {
      return false;
    }
    return string(input).slugify().toString();
  });

  eleventyConfig.addFilter("bust", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", Date.now());
    return `${urlPart}?${params}`;
  });

  return {
    pathPrefix: "/",
    templateFormats: ["html", "njk"],
    passthroughFileCopy: true,
    dir: {
      input: "src/views",
      includes: "_includes",
      data: "_data",
      output: "dist",
    },
  };
};
