export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(markdown: string): TocItem[] {
  if (!markdown) return [];
  
  // Match lines starting with # or ## only (excluding ###, ####, etc.)
  const headingLines = markdown.match(/^#{1,2}\s+(.+)$/gm) || [];
  
  return headingLines
    .map((line) => {
      const match = line.match(/^(#{1,2})\s+(.+)$/);
      if (!match) return null;
      const hashes = match[1];
      const rawText = match[2].replace(/#+\s*$/, "").trim();
      // Remove markdown links or bold text formatting inside headings
      const cleanText = rawText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/[*_`]/g, "");
      
      return {
        id: slugifyHeading(cleanText),
        text: cleanText,
        level: hashes.length,
      };
    })
    .filter((item): item is TocItem => item !== null && item.id !== "");
}
