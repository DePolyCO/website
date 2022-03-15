import { IoBriefcaseOutline } from "react-icons/io5";

export default {
  name: "jobs",
  title: "Jobs",
  type: "document",
  i18n: true,
  icon: IoBriefcaseOutline,
  fields: [
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
      name: "level",
      title: "Level",
      type: "string",
      options: {
        list: [
          { title: "Senior", value: "Senior" },
          { title: "Midior", value: "Midior" },
          { title: "Junior", value: "Junior" },
        ],
      },
    },

    {
      name: "description",
      type: "text",
      title: "Description",
    },

    {
      name: "dept",
      title: "Department",
      type: "string",
      options: {
        list: [{ title: "Technology", value: "Technology" }],
      },
    },

    {
      name: "hours",
      title: "Hours",
      type: "string",
      options: {
        list: [{ title: "Full-Time", value: "Full-Time" }],
      },
    },

    {
      name: "location",
      title: "Location",
      type: "string",
    },

    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    },

    {
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    },

    {
      name: "expectaions",
      title: "Expectaions",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    },

    {
      name: "Offering",
      title: "What we offer",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
    },
  ],
};
