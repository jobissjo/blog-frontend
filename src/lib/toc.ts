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
  
  // Match lines starting with ## or ###
  const headingLines = markdown.match(/^(##|###)\s+(.+)$/gm) || [];
  
  return headingLines.map((line) => {
    const isH3 = line.startsWith("###");
    const rawText = line.replace(/^(##|###)\s+/, "").replace(/#+\s*$/, "").trim();
    // Remove markdown links or bold text formatting inside headings
    const cleanText = rawText.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1").replace(/[*_`]/g, "");
    
    return {
      id: slugifyHeading(cleanText),
      text: cleanText,
      level: isH3 ? 3 : 2,
    };
  });
}
