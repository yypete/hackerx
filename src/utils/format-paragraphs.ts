export const formatParagraphs = (text: string | undefined | null): string[] => {
  if (!text) return [];
  return text
    .split(/<\/?p>/)
    .filter((paragraph) => paragraph.trim() !== "")
    .map((paragraph) => paragraph.trim());
};
