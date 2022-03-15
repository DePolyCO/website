import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

import { IoCreateOutline } from "react-icons/io5";

export default {
  name: "post",
  title: "Post",
  type: "document",
  i18n: true,
  orderings: [orderRankOrdering],
  icon: IoCreateOutline,
  fields: [
    orderRankField({ type: "post" }),
    {
      name: "title",
      title: "Title",
      type: "string",
    },
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
      name: "mainImage",
      title: "Main image",
      type: "image",
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
    },
    {
      name: "postCategory",
      title: "Post Category",
      type: "reference",
      to: { type: "category" },
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent",
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
