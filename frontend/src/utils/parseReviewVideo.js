import { resolveMediaUrl, videoMimeFromUrl } from "./resolveMediaUrl.js";

/** Parse a review video URL into embed/file metadata. */
export function parseReviewVideo(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtubeMatch) {
    const id = youtubeMatch[1];
    return {
      kind: "youtube",
      src: trimmed,
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`,
    };
  }

  const playbackSrc = resolveMediaUrl(trimmed);
  return {
    kind: "file",
    src: trimmed,
    playbackSrc,
    mimeType: videoMimeFromUrl(playbackSrc),
    embedUrl: null,
  };
}

export function isVideoGalleryItem(item) {
  return item?.type === "video";
}
