const htmlmin = require("html-minifier");

const urlFor = require("./utils/imageUrl");
const buildFileUrl = require("./utils/fileUrl");

const string = require("string");
const fs = require("fs");

require("dotenv").config();

const extractExcerpt = (article) => {
  if (!article.hasOwnProperty("templateContent")) {
    console.warn(
      'Failed to extract excerpt: Document has no property "templateContent".'
    );
    return null;
  }

  let excerpt = null;
  const content = article.templateContent;

  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    // { start: "<!-- Excerpt Start -->", end: "<!-- Excerpt End -->" },
    { start: "<p>", end: "</p>" },
  ];

  separatorsList.some((separators) => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.indexOf(separators.end);

    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content
        .substring(startPosition + separators.start.length, endPosition)
        .trim();
      return true; // Exit out of array loop on first match
    }
  });
  return excerpt;
};

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

  eleventyConfig.addShortcode("imageUrlFor", (image, width = "400") => {
    return urlFor(image).width(width).auto("format");
  });
  eleventyConfig.addShortcode("croppedUrlFor", (image, width, height) => {
    return urlFor(image).width(width).height(height).auto("format");
  });

  eleventyConfig.addShortcode(
    "responsiveImage",
    (
      image,
      srcs = "300,600,1200,2000",
      sizes = "100vw",
      classList = "",
      alt = "",
      important = false
    ) => {
      const sizeArray = srcs.split(",");
      const firstSize = sizeArray[0];
      const lastSize = sizeArray[sizeArray.length - 1];
      const srcSetContent = sizeArray
        .map((size) => {
          const url = urlFor(image).width(size).auto("format").url();

          return `${url} ${size}w`;
        })
        .join(",");

      return `<img 
            src="${urlFor(image).width(firstSize)}"
            ${classList ? "class='" + classList + "'" : ""}
            srcset="${srcSetContent}"
            sizes="${sizes}"
            width="${lastSize.trim()}"
            loading="${important ? "eager" : "lazy"}"
            decoding="${important ? "sync" : "async"}"
            alt="${alt ? alt : "Image alt"}"
            >`;
    }
  );

  eleventyConfig.addNunjucksShortcode("fileUrlFor", (file) => {
    return buildFileUrl(file);
  });

  eleventyConfig.addShortcode("excerpt", (article) => extractExcerpt(article));

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
