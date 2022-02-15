module.exports = {
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID || "FILLIN",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2021-05-30",
    useCdn: false,
  },
};
