export default function uniqueFilter(document, field) {
  const { type } = document;

  const existingEntries = document[field]
    .map((existingEntry) => existingEntry._ref)
    .filter(Boolean);

  return {
    filter: `!(_id in $existingEntries) && type == "${type}"`,
    params: {
      existingEntries,
    },
  };
}
