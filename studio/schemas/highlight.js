import { IoStarOutline } from "react-icons/io5";
import React from "react";

export default {
  name: "highlight",
  title: "Highlights",
  type: "document",
  icon: IoStarOutline,
  fields: [
    {
      title: "Type",
      name: "type",
      type: "string",
      description: "Type of highlight. Text or Image.",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Image", value: "image" }
        ]
      },
      validation: (Rule) => Rule.required()
    },
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
      description: "Link to the page that will be opened when the highlight is clicked.",
    },
    {
      title: "Text",
      name: "text",
      type: "string",
      description: "Text of the highlight.",
      hidden: ({ document }) => document.type === "image",
      validation: (Rule) => Rule.custom((value, { document }) => {
        if (document.type === "image") {
          return true;
        }

        return typeof value === 'string' && value.trim().length > 0 || "Please enter a link text.";
      }),
    },
    {
      title: "Image",
      name: "image",
      type: "image",
      hidden: ({ document }) => document.type === "text",
      validation: (Rule) => Rule.custom((value, { document }) => {
        if (document.type === "text") {
          return true;
        }

        return !!value || "Please set an image.";
      }),
      options: {
        hotspot: true,
      },
      description: "Image of the highlight.",
    },
  ],
};
