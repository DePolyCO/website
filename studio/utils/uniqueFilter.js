export default function uniqueFilter(document, field) {
  const existingEntries = document[field]
    .map((existingEntry) => existingEntry._ref)
    .filter(Boolean);

  return {
    filter: "!(_id in $existingEntries)",
    params: {
      existingEntries,
    },
  };
}
