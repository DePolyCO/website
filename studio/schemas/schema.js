import createSchema from "part:@sanity/base/schema-creator";
import schemaTypes from "all:part:@sanity/base/schema-type";

import seo from "./seo";
import category from "./category";
import person from "./person";
import post from "./post";
import team from "./team";
import jobs from "./jobs";

import featuredPost from "./featuredPost";
import blockContent from "./blockContent";
import bioContent from "./bioContent";
import youtube from "./youtube";

export default createSchema({
  name: "default",
  types: schemaTypes.concat([
    // Documents
    seo,
    post,
    category,
    person,
    featuredPost,
    team,
    jobs,

    // Objects
    blockContent,
    bioContent,
    youtube,
  ]),
});
