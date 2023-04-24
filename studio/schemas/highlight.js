import { IoStarOutline } from "react-icons/io5";
import React from "react";

export default {
  name: "highlight",
  title: "Highlights",
  type: "document",
  icon: IoStarOutline,
  initialValue: {
    type: "text"
  },
  fields: [
    {
      title: "Type",
      name: "type",
      type: "string",
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
      validation: (Rule) => Rule.required(),
    },
    {
      title: "Text",
      name: "text",
      type: "string",
      description: "Text shown on the link.",
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
      description: "Logo of the highlight. If not provided, the Link Text will be used instead.",
    },
  ],
};
