export const pageTitle = (title: string) => `${title} – Row Seven`;

export const yearSuffix = (date?: string) =>
  date ? ` (${date.slice(0, 4)})` : "";
