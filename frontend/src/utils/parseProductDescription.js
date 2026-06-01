/** Admin description point separator (Product Detail Delimiter). */
export const DESCRIPTION_SEPARATOR = "PDD";

/** Turn a plain-text product description into scannable list items. */
export function parseProductDescription(text) {
  if (!text?.trim()) return [];

  const normalized = text.trim().replace(/\s+/g, " ");

  if (/\s*PDD\s*/i.test(normalized)) {
    return normalized
      .split(/\s*PDD\s*/i)
      .map((part) => part.trim().replace(/[.!?]$/, ""))
      .filter(Boolean);
  }

  if (normalized.includes("\n")) {
    return normalized
      .split(/\n+/)
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  }

  if (/^[-•*]\s/m.test(normalized) || /;\s*[-•*]\s/.test(normalized)) {
    return normalized
      .split(/\s*[-•*]\s+/)
      .map((part) => part.replace(/[;,.]$/, "").trim())
      .filter(Boolean);
  }

  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length > 1) return sentences;

  if (normalized.includes(",")) {
    return normalized
      .split(/,\s+/)
      .map((part, index, arr) => {
        let item = part.trim();
        if (index === arr.length - 1) {
          item = item.replace(/[.!?]$/, "");
        }
        return item;
      })
      .filter(Boolean);
  }

  return [normalized];
}
