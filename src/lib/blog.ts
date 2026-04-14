import { existsSync, readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import {
  getBlogFilePath,
  getContentSectionDirectory,
} from "@/lib/content/contentPaths";
import { renderMarkdownToHtml } from "@/lib/content/renderMarkdownToHtml";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
const TITLE_TOKEN_WEIGHT = 3;
const DESCRIPTION_TOKEN_WEIGHT = 2;
const BODY_TOKEN_WEIGHT = 1;
const MINIMUM_TOKEN_LENGTH = 3;
const MAX_DOCUMENT_FREQUENCY_RATIO = 0.6;

const STEP_TWO_SUFFIXES: ReadonlyArray<{
  readonly suffix: string;
  readonly replacement: string;
}> = [
  { suffix: "ational", replacement: "ate" },
  { suffix: "tional", replacement: "tion" },
  { suffix: "enci", replacement: "ence" },
  { suffix: "anci", replacement: "ance" },
  { suffix: "izer", replacement: "ize" },
  { suffix: "abli", replacement: "able" },
  { suffix: "alli", replacement: "al" },
  { suffix: "entli", replacement: "ent" },
  { suffix: "eli", replacement: "e" },
  { suffix: "ousli", replacement: "ous" },
  { suffix: "ization", replacement: "ize" },
  { suffix: "ation", replacement: "ate" },
  { suffix: "ator", replacement: "ate" },
  { suffix: "alism", replacement: "al" },
  { suffix: "iveness", replacement: "ive" },
  { suffix: "fulness", replacement: "ful" },
  { suffix: "ousness", replacement: "ous" },
  { suffix: "aliti", replacement: "al" },
  { suffix: "iviti", replacement: "ive" },
  { suffix: "biliti", replacement: "ble" },
  { suffix: "logi", replacement: "log" },
];

const STEP_THREE_SUFFIXES: ReadonlyArray<{
  readonly suffix: string;
  readonly replacement: string;
}> = [
  { suffix: "icate", replacement: "ic" },
  { suffix: "ative", replacement: "" },
  { suffix: "alize", replacement: "al" },
  { suffix: "iciti", replacement: "ic" },
  { suffix: "ical", replacement: "ic" },
  { suffix: "ful", replacement: "" },
  { suffix: "ness", replacement: "" },
];

const STEP_FOUR_SUFFIXES: ReadonlyArray<string> = [
  "ement",
  "ance",
  "ence",
  "able",
  "ible",
  "ment",
  "ant",
  "ent",
  "ism",
  "ate",
  "iti",
  "ous",
  "ive",
  "ize",
  "al",
  "er",
  "ic",
  "ou",
];

const STOP_WORDS = new Set<string>([
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "also",
  "always",
  "among",
  "and",
  "another",
  "any",
  "are",
  "around",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "can",
  "could",
  "did",
  "does",
  "doing",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "has",
  "have",
  "having",
  "here",
  "how",
  "into",
  "its",
  "just",
  "made",
  "make",
  "many",
  "might",
  "more",
  "most",
  "much",
  "must",
  "never",
  "now",
  "off",
  "often",
  "only",
  "other",
  "our",
  "out",
  "over",
  "same",
  "should",
  "some",
  "such",
  "than",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "too",
  "under",
  "until",
  "very",
  "want",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "while",
  "will",
  "with",
  "without",
  "would",
  "you",
  "your",
]);

interface BlogFrontmatterInput {
  readonly title?: unknown;
  readonly description?: unknown;
  readonly date?: unknown;
}

export interface BlogPostRecord {
  readonly slug: string;
  readonly locale: AppLocale;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly publishedAt: number;
  readonly bodyMarkdown: string;
}

export interface BlogPostContent extends BlogPostRecord {
  readonly contentHtml: string;
}

export interface RecommendedBlogPost {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
}

interface ArticleTokenVector {
  readonly weights: ReadonlyMap<string, number>;
  readonly magnitude: number;
}

interface RankedRecommendation {
  readonly post: BlogPostRecord;
  readonly score: number;
}

let cachedBlogPosts: ReadonlyArray<BlogPostRecord> | null = null;
const cachedBlogPostsByLocale = new Map<AppLocale, ReadonlyArray<BlogPostRecord>>();
let cachedArticleVectors: ReadonlyMap<string, ArticleTokenVector> | null = null;
const renderedHtmlBySlug = new Map<string, Promise<string>>();

function assertNonEmptyString(
  value: unknown,
  fieldName: string,
  filePath: string
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid blog ${fieldName} in ${filePath}`);
  }

  return value.trim();
}

function parsePublishedAt(date: string, filePath: string): number {
  const publishedAt = Date.parse(date);

  if (Number.isNaN(publishedAt)) {
    throw new Error(`Invalid blog date in ${filePath}: ${date}`);
  }

  return publishedAt;
}

function getSlugFromFileName(fileName: string): string {
  return fileName.replace(/\.md$/, "");
}

function hasBlogFile(slug: string, locale: AppLocale): boolean {
  return existsSync(getBlogFilePath(slug, locale));
}

function parseBlogPost(slug: string, locale: AppLocale): BlogPostRecord {
  const filePath = getBlogFilePath(slug, locale);

  if (!existsSync(filePath)) {
    throw new Error(
      `Missing blog content for slug ${slug} locale ${locale}: ${filePath}`
    );
  }

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogFrontmatterInput;
  const title = assertNonEmptyString(frontmatter.title, "title", filePath);
  const description = assertNonEmptyString(
    frontmatter.description,
    "description",
    filePath
  );
  const date = assertNonEmptyString(frontmatter.date, "date", filePath);

  return {
    slug,
    locale,
    title,
    description,
    date,
    publishedAt: parsePublishedAt(date, filePath),
    bodyMarkdown: content,
  };
}

function compareByPublishedAtDescending(
  leftPost: BlogPostRecord,
  rightPost: BlogPostRecord
): number {
  return rightPost.publishedAt - leftPost.publishedAt;
}

function getDefaultLocaleBlogSlugs(): ReadonlyArray<string> {
  if (cachedBlogPosts !== null) {
    return cachedBlogPosts.map((post) => post.slug);
  }

  const defaultLocaleBlogDirectory = getContentSectionDirectory(
    DEFAULT_LOCALE,
    "blog"
  );

  if (!existsSync(defaultLocaleBlogDirectory)) {
    cachedBlogPosts = [];
    return [];
  }

  cachedBlogPosts = readdirSync(defaultLocaleBlogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(getSlugFromFileName)
    .map((slug) => parseBlogPost(slug, DEFAULT_LOCALE))
    .sort(compareByPublishedAtDescending);

  return cachedBlogPosts.map((post) => post.slug);
}

function loadBlogPosts(locale: AppLocale): ReadonlyArray<BlogPostRecord> {
  const cachedPosts = cachedBlogPostsByLocale.get(locale);

  if (cachedPosts !== undefined) {
    return cachedPosts;
  }

  const slugs = getDefaultLocaleBlogSlugs().filter((slug) =>
    hasBlogFile(slug, locale)
  );
  const posts = slugs
    .map((slug) => parseBlogPost(slug, locale))
    .sort(compareByPublishedAtDescending);

  cachedBlogPostsByLocale.set(locale, posts);
  return posts;
}

function stripMarkdownForAnalysis(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/www\.\S+/g, " ");
}

function isConsonant(word: string, index: number): boolean {
  const character = word[index];

  if ("aeiou".includes(character)) {
    return false;
  }

  if (character === "y") {
    if (index === 0) {
      return true;
    }

    return !isConsonant(word, index - 1);
  }

  return true;
}

function containsVowel(word: string): boolean {
  for (let index = 0; index < word.length; index += 1) {
    if (!isConsonant(word, index)) {
      return true;
    }
  }

  return false;
}

function measureStem(word: string): number {
  let measure = 0;
  let previousWasVowel = false;

  for (let index = 0; index < word.length; index += 1) {
    const isVowel = !isConsonant(word, index);

    if (isVowel) {
      previousWasVowel = true;
      continue;
    }

    if (previousWasVowel) {
      measure += 1;
      previousWasVowel = false;
    }
  }

  return measure;
}

function endsWithDoubleConsonant(word: string): boolean {
  if (word.length < 2) {
    return false;
  }

  const lastCharacter = word[word.length - 1];
  const previousCharacter = word[word.length - 2];

  return (
    lastCharacter === previousCharacter && isConsonant(word, word.length - 1)
  );
}

function isConsonantVowelConsonant(word: string): boolean {
  if (word.length < 3) {
    return false;
  }

  const lastIndex = word.length - 1;
  const lastCharacter = word[lastIndex];

  if (
    !isConsonant(word, lastIndex) ||
    isConsonant(word, lastIndex - 1) ||
    !isConsonant(word, lastIndex - 2)
  ) {
    return false;
  }

  return !["w", "x", "y"].includes(lastCharacter);
}

function applySuffixReplacements(
  word: string,
  replacements: ReadonlyArray<{
    readonly suffix: string;
    readonly replacement: string;
  }>,
  requiredMeasure: number
): string {
  for (const replacement of replacements) {
    if (!word.endsWith(replacement.suffix)) {
      continue;
    }

    const stem = word.slice(0, -replacement.suffix.length);

    if (measureStem(stem) < requiredMeasure) {
      return word;
    }

    return `${stem}${replacement.replacement}`;
  }

  return word;
}

function stemToken(token: string): string {
  if (token.length < 3) {
    return token;
  }

  let word = token;

  if (word.endsWith("sses")) {
    word = `${word.slice(0, -4)}ss`;
  } else if (word.endsWith("ies")) {
    word = `${word.slice(0, -3)}i`;
  } else if (!word.endsWith("ss") && word.endsWith("s")) {
    word = word.slice(0, -1);
  }

  let stepOneBApplied = false;

  if (word.endsWith("eed")) {
    const stem = word.slice(0, -3);

    if (measureStem(stem) > 0) {
      word = `${stem}ee`;
    }
  } else if (word.endsWith("ed")) {
    const stem = word.slice(0, -2);

    if (containsVowel(stem)) {
      word = stem;
      stepOneBApplied = true;
    }
  } else if (word.endsWith("ing")) {
    const stem = word.slice(0, -3);

    if (containsVowel(stem)) {
      word = stem;
      stepOneBApplied = true;
    }
  }

  if (stepOneBApplied) {
    if (
      word.endsWith("at") ||
      word.endsWith("bl") ||
      word.endsWith("iz")
    ) {
      word = `${word}e`;
    } else if (
      endsWithDoubleConsonant(word) &&
      !word.endsWith("l") &&
      !word.endsWith("s") &&
      !word.endsWith("z")
    ) {
      word = word.slice(0, -1);
    } else if (measureStem(word) === 1 && isConsonantVowelConsonant(word)) {
      word = `${word}e`;
    }
  }

  if (word.endsWith("y")) {
    const stem = word.slice(0, -1);

    if (containsVowel(stem)) {
      word = `${stem}i`;
    }
  }

  word = applySuffixReplacements(word, STEP_TWO_SUFFIXES, 1);
  word = applySuffixReplacements(word, STEP_THREE_SUFFIXES, 1);

  if (word.endsWith("ion")) {
    const stem = word.slice(0, -3);

    if (
      measureStem(stem) >= 2 &&
      (stem.endsWith("s") || stem.endsWith("t"))
    ) {
      word = stem;
    }
  } else {
    for (const suffix of STEP_FOUR_SUFFIXES) {
      if (!word.endsWith(suffix)) {
        continue;
      }

      const stem = word.slice(0, -suffix.length);

      if (measureStem(stem) >= 2) {
        word = stem;
      }

      break;
    }
  }

  if (word.endsWith("e")) {
    const stem = word.slice(0, -1);
    const stemMeasure = measureStem(stem);

    if (stemMeasure > 1 || (stemMeasure === 1 && !isConsonantVowelConsonant(stem))) {
      word = stem;
    }
  }

  if (measureStem(word) > 1 && endsWithDoubleConsonant(word) && word.endsWith("l")) {
    word = word.slice(0, -1);
  }

  return word;
}

function tokenizeText(text: string): ReadonlyArray<string> {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/);
  const normalizedTokens: string[] = [];

  for (const token of tokens) {
    if (token.length < MINIMUM_TOKEN_LENGTH) {
      continue;
    }

    if (STOP_WORDS.has(token) || /^\d+$/.test(token)) {
      continue;
    }

    const stem = stemToken(token);

    if (stem.length < MINIMUM_TOKEN_LENGTH || STOP_WORDS.has(stem)) {
      continue;
    }

    normalizedTokens.push(stem);
  }

  return normalizedTokens;
}

function addWeightedTokens(
  tokenWeights: Map<string, number>,
  tokens: ReadonlyArray<string>,
  weight: number
): void {
  for (const token of tokens) {
    const previousWeight = tokenWeights.get(token) ?? 0;
    tokenWeights.set(token, previousWeight + weight);
  }
}

function buildWeightedTokens(post: BlogPostRecord): Map<string, number> {
  const tokenWeights = new Map<string, number>();

  addWeightedTokens(
    tokenWeights,
    tokenizeText(post.title),
    TITLE_TOKEN_WEIGHT
  );
  addWeightedTokens(
    tokenWeights,
    tokenizeText(post.description),
    DESCRIPTION_TOKEN_WEIGHT
  );
  addWeightedTokens(
    tokenWeights,
    tokenizeText(stripMarkdownForAnalysis(post.bodyMarkdown)),
    BODY_TOKEN_WEIGHT
  );

  return tokenWeights;
}

function buildArticleVectors(): ReadonlyMap<string, ArticleTokenVector> {
  if (cachedArticleVectors !== null) {
    return cachedArticleVectors;
  }

  const posts = loadBlogPosts(DEFAULT_LOCALE);
  const rawTokenWeightsBySlug = new Map<string, Map<string, number>>();
  const documentFrequencyByToken = new Map<string, number>();

  for (const post of posts) {
    const tokenWeights = buildWeightedTokens(post);
    rawTokenWeightsBySlug.set(post.slug, tokenWeights);

    for (const token of tokenWeights.keys()) {
      const previousFrequency = documentFrequencyByToken.get(token) ?? 0;
      documentFrequencyByToken.set(token, previousFrequency + 1);
    }
  }

  const articleVectors = new Map<string, ArticleTokenVector>();

  for (const post of posts) {
    const rawTokenWeights = rawTokenWeightsBySlug.get(post.slug);

    if (!rawTokenWeights) {
      throw new Error(`Missing token weights for blog post: ${post.slug}`);
    }

    const weights = new Map<string, number>();
    let magnitudeSquared = 0;

    for (const [token, weightedCount] of rawTokenWeights.entries()) {
      const documentFrequency = documentFrequencyByToken.get(token);

      if (documentFrequency === undefined) {
        throw new Error(`Missing document frequency for blog token: ${token}`);
      }

      if (
        documentFrequency <= 1 ||
        documentFrequency / posts.length > MAX_DOCUMENT_FREQUENCY_RATIO
      ) {
        continue;
      }

      const inverseDocumentFrequency =
        Math.log((posts.length + 1) / (documentFrequency + 1)) + 1;
      const weightedValue = weightedCount * inverseDocumentFrequency;

      weights.set(token, weightedValue);
      magnitudeSquared += weightedValue * weightedValue;
    }

    articleVectors.set(post.slug, {
      weights,
      magnitude: Math.sqrt(magnitudeSquared),
    });
  }

  cachedArticleVectors = articleVectors;
  return cachedArticleVectors;
}

function getCosineSimilarity(
  leftVector: ArticleTokenVector,
  rightVector: ArticleTokenVector
): number {
  if (leftVector.magnitude === 0 || rightVector.magnitude === 0) {
    return 0;
  }

  const smallerVector =
    leftVector.weights.size <= rightVector.weights.size
      ? leftVector.weights
      : rightVector.weights;
  const largerVector =
    leftVector.weights.size <= rightVector.weights.size
      ? rightVector.weights
      : leftVector.weights;
  let dotProduct = 0;

  for (const [token, leftWeight] of smallerVector.entries()) {
    const rightWeight = largerVector.get(token);

    if (rightWeight !== undefined) {
      dotProduct += leftWeight * rightWeight;
    }
  }

  return dotProduct / (leftVector.magnitude * rightVector.magnitude);
}

function toRecommendedBlogPost(post: BlogPostRecord): RecommendedBlogPost {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
  };
}

function compareRankedRecommendations(
  leftRecommendation: RankedRecommendation,
  rightRecommendation: RankedRecommendation
): number {
  if (rightRecommendation.score !== leftRecommendation.score) {
    return rightRecommendation.score - leftRecommendation.score;
  }

  return compareByPublishedAtDescending(
    leftRecommendation.post,
    rightRecommendation.post
  );
}

export function getAvailableBlogLocales(slug: string): ReadonlyArray<AppLocale> {
  if (!getDefaultLocaleBlogSlugs().includes(slug)) {
    return [];
  }

  return SUPPORTED_LOCALES.filter((locale) => hasBlogFile(slug, locale));
}

export function getAvailableBlogIndexLocales(): ReadonlyArray<AppLocale> {
  return SUPPORTED_LOCALES.filter((locale) => listBlogPosts(locale).length > 0);
}

export function listBlogPosts(locale: AppLocale): ReadonlyArray<BlogPostRecord> {
  return loadBlogPosts(locale);
}

export function readBlogPost(
  slug: string,
  locale: AppLocale
): BlogPostRecord | null {
  return loadBlogPosts(locale).find((post) => post.slug === slug) ?? null;
}

export async function readBlogPostContent(
  slug: string,
  locale: AppLocale
): Promise<BlogPostContent | null> {
  const post = readBlogPost(slug, locale);

  if (post === null) {
    return null;
  }

  const cacheKey = `${locale}:${slug}`;
  const cachedHtml = renderedHtmlBySlug.get(cacheKey);
  const contentHtmlPromise =
    cachedHtml ?? renderMarkdownToHtml(post.bodyMarkdown);

  if (cachedHtml === undefined) {
    renderedHtmlBySlug.set(cacheKey, contentHtmlPromise);
  }

  return {
    ...post,
    contentHtml: await contentHtmlPromise,
  };
}

export function getRecommendedBlogPosts(
  locale: AppLocale,
  slug: string,
  limit: number
): ReadonlyArray<RecommendedBlogPost> {
  const currentPost = readBlogPost(slug, DEFAULT_LOCALE);

  if (currentPost === null) {
    throw new Error(`Cannot recommend blog posts for missing slug: ${slug}`);
  }

  const articleVectors = buildArticleVectors();
  const currentVector = articleVectors.get(slug);

  if (currentVector === undefined) {
    throw new Error(`Missing recommendation vector for blog post: ${slug}`);
  }

  const rankedRecommendations: RankedRecommendation[] = [];

  for (const post of loadBlogPosts(DEFAULT_LOCALE)) {
    if (post.slug === slug) {
      continue;
    }

    const candidateVector = articleVectors.get(post.slug);

    if (candidateVector === undefined) {
      throw new Error(
        `Missing recommendation vector for candidate blog post: ${post.slug}`
      );
    }

    rankedRecommendations.push({
      post,
      score: getCosineSimilarity(currentVector, candidateVector),
    });
  }

  const scoredRecommendations = rankedRecommendations
    .filter((recommendation) => recommendation.score > 0)
    .sort(compareRankedRecommendations)
    .map((recommendation) => toRecommendedBlogPost(recommendation.post));
  const fallbackRecommendations = rankedRecommendations
    .filter((recommendation) => recommendation.score <= 0)
    .sort(compareRankedRecommendations)
    .map((recommendation) => toRecommendedBlogPost(recommendation.post));

  return [...scoredRecommendations, ...fallbackRecommendations]
    .map((recommendation) => readBlogPost(recommendation.slug, locale))
    .filter((post): post is BlogPostRecord => post !== null)
    .map(toRecommendedBlogPost)
    .slice(0, limit);
}
