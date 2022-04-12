// import {
//   orderRankField,
//   orderRankOrdering,
// } from "@sanity/orderable-document-list";

import { IoCreateOutline } from "react-icons/io5";

export default {
  name: "post",
  title: "Posts",
  type: "document",
  i18n: true,
  // orderings: [orderRankOrdering],
  icon: IoCreateOutline,
  fields: [
    // orderRankField({ type: "post" }),
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "settings",
      title: "Settings",
      type: "object",
      fields: [
        {
          name: "slug",
          title: "Slug",
          type: "slug",
          options: {
            source: "title",
            maxLength: 96,
            isUnique: () => true,
          },
        },

        {
          name: "postCategory",
          title: "Post Category",
          type: "reference",
          to: { type: "category" },
          validation: (Rule) => Rule.required(),
        },

        {
          name: "publishedAt",
          title: "Published at",
          type: "datetime",
          validation: (Rule) => Rule.required(),
        },
      ],
    },

    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt description",
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },

    {
      name: "intro",
      title: "Short Intro",
      type: "text",
      validation: (Rule) => Rule.required().max(700),
    },

    {
      name: "body",
      title: "Body",
      type: "blockContent",
    },

    {
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Add keywords that describes your article.",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(3).max(7),
    },
  ],

  preview: {
    select: {
      title: "title",
      media: "mainImage",
    },
    prepare(selection) {
      return Object.assign({}, selection, {});
    },
  },
};
