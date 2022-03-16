import { IoSettingsOutline } from "react-icons/io5";

export default {
  name: "seo",
  type: "document",
  title: "SEO Settings",
  i18n: true,
  icon: IoSettingsOutline,
  __experimental_actions: [/*'create',*/ "update", /*'delete',*/ "publish"],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
      description: "Describe your site for search engines and social media.",
    },
    {
      name: "keywords",
      type: "array",
      title: "Keywords",
      description: "Add keywords that describes your site.",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
  ],
};
