export default {
  name: "privacy",
  type: "document",
  title: "Privacy Policy / Terms & Conditions",
  i18n: false,
  fields: [
    {
      name: "body",
      title: "Body",
      type: "privacyContent",
    },
  ],
  preview: {
    select: {
      title: "title",
    },
  },
};