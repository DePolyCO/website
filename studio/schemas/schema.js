import schemaTypes from "all:part:@sanity/base/schema-type";
import createSchema from "part:@sanity/base/schema-creator";

import activeBanner from "./activeBanner";
import banner from "./banner";
import category from "./category";
import depolyInNumbers from "./depolyInNumbers";
import highlight from "./highlight";
import jobs from "./jobs";
import person from "./person";
import post from "./post";
import privacy from "./privacy";
import seo from "./seo";
import team from "./team";

import bioContent from "./bioContent";
import blockContent from "./blockContent";
import featuredPost from "./featuredPost";
import privacyContent from "./privacyContent";
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
    privacy,
    activeBanner,
    banner,
    highlight,
    depolyInNumbers,

    // Objects
    blockContent,
    bioContent,
    privacyContent,
    youtube,
  ]),
});
