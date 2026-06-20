interface ArticleHtmlSegments {
  readonly chunks: readonly string[];
  readonly midInsertIndex: number | null;
}

// Splits rendered article HTML on top-level <h2> boundaries and picks the H2
// boundary nearest the character midpoint for a mid-article CTA. chunks[0] is
// the intro before the first <h2>; chunks[1..] each start with a <h2>.
export function getArticleHtmlSegments(contentHtml: string): ArticleHtmlSegments {
  const chunks = contentHtml.split(/(?=<h2)/);
  const sectionCount = chunks.length - 1;
  // Too few sections to warrant a mid CTA; only the end CTA will be shown.
  if (sectionCount < 4) {
    return { chunks, midInsertIndex: null };
  }
  const halfway = contentHtml.length / 2;
  const offsets: number[] = [];
  let acc = 0;
  for (const chunk of chunks) {
    offsets.push(acc);
    acc += chunk.length;
  }
  // Keep the CTA away from the very first and very last boundary so it sits
  // mid-article and never collides with the end CTA.
  let bestIndex = 2;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 2; index <= chunks.length - 2; index++) {
    const distance = Math.abs(offsets[index] - halfway);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return { chunks, midInsertIndex: bestIndex };
}
