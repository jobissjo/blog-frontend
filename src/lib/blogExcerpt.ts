const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const IMAGE_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
const INLINE_CODE_REGEX = /`([^`]+)`/g;
const HTML_TAG_REGEX = /<[^>]*>/g;
const BLOCK_PREFIX_REGEX = /^\s{0,3}(#{1,6}|\*|-|\+|>|\d+\.)\s?/gm;
const MARKDOWN_DECORATION_REGEX = /[*_~]/g;

export function getBlogExcerpt(content?: string, maxLength = 160) {
  if (!content) return "";

  const plainText = content
    .replace(CODE_BLOCK_REGEX, " ")
    .replace(IMAGE_REGEX, " ")
    .replace(MARKDOWN_LINK_REGEX, "$1")
    .replace(INLINE_CODE_REGEX, "$1")
    .replace(HTML_TAG_REGEX, " ")
    .replace(BLOCK_PREFIX_REGEX, "")
    .replace(MARKDOWN_DECORATION_REGEX, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}
