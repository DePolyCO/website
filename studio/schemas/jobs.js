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
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "An unique identifier for this role. Notifications to this role will mention this tag. Kindly ensure that this is unique!",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: () => true,
        validation: (Rule) => Rule.required(),
      },
    },

    {
      title: "Are you currently hiring for this role?",
      description:
        "Turning this off will remove the job listing from the website!",
      name: "active",
      type: "boolean",
      options: {
        layout: "checkbox",
      },
    },

    {
      name: "level",
      title: "Level",
      type: "object",
      fields: [
        {
          name: "Junior",
          title: "Junior",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "Medior",
          title: "Mid-Level",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "Senior",
          title: "Senior",
          type: "boolean",
          initialValue: false,
        },
      ],
      validation: (Rule) => Rule.required(),
    },

    {
      name: "description",
      type: "text",
      title: "Description",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "dept",
      title: "Department",
      type: "string",
      validation: (Rule) => Rule.required(),
    },

    {
      name: "hours",
      title: "Hours",
      type: "string",
      options: {
        list: [
          { title: "Full-Time", value: "Full-Time" },
          { title: "Part-Time", value: "Part-Time" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },

    {
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: "expectations",
      title: "Expectations",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },

    {
      name: "offering",
      title: "What we offer",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  initialValue: {
    active: true,
  },
};
