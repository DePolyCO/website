const lunrjs = require("lunr");

function createIndex(posts) {
  return lunrjs(function () {
    this.ref("id");
    this.field("title");
    this.field("content");
    this.field("date");

    posts.forEach((p, idx) => {
      p.id = idx;
      this.add(p);
    });
  });
}

const handler = async (event) => {
  try {
    const search = event.queryStringParameters.term;
    if (!search) throw "Missing term query parameter";

    const data = require("../netlify/lambda/article-index.json");
    const index = createIndex(data);

    let results = index.search(search);

    const finalData = results.map((r) => {
      // r.title = data[r.ref].title;
      // r.date = data[r.ref].date;
      // r.content = data[r.ref].content;
      // r.url = data[r.ref].url;
      // r._id = data[r.ref]._id;

      return {
        ...data[r.ref],
      };

      // delete r.matchData;
      // delete r.ref;
    });

    // TODO: Remove CORS
    return {
      statusCode: 200,
      body: JSON.stringify(finalData),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString(),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

module.exports = { handler };
