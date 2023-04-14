import { IoStarOutline } from "react-icons/io5";
import React from "react";

export default {
  name: "highlight",
  title: "Highlights",
  type: "document",
  icon: IoStarOutline,
  fields: [
    {
      title: "Title",
      name: "title",
      type: "string",
      description: "Used as a help to easily identify the highlight.",
    },
    {
      title: "Link",
      name: "link",
      type: "url",
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Link Text",
      name: "linkText",
      type: "string",
      description: "Text shown on the link.",
    },
    {
      title: "Logo",
      name: "logo",
      type: "image",
      options: {
        hotspot: true,
      },
      description:
        "Logo of the highlight. If not provided, the Link Text will be used instead.",
    },
  ],
};
