import { computed, type ComputedRef, type Ref } from "vue";

interface EditorStats {
  words: number;
  characters: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

const WORD_REGEX = /\b[a-záéíóúñ]+(?:'[a-záéíóúñ]+)?\b/gi;
const PARAGRAPH_REGEX = /\n\n+/g;

const READING_SPEED_WPM = 200;

const countWords = (text: string): number => {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const matches = text.match(WORD_REGEX);
  return matches ? matches.length : 0;
};

const countCharacters = (text: string): number => {
  if (!text || typeof text !== "string") {
    return 0;
  }

  return text.length;
};

const countParagraphs = (text: string): number => {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const cleaned = text.trim();
  if (!cleaned) {
    return 0;
  }

  const paragraphs = cleaned.split(PARAGRAPH_REGEX);
  return paragraphs.filter((p) => p.trim().length > 0).length;
};

const calculateReadingTime = (wordCount: number): number => {
  if (wordCount === 0) {
    return 0;
  }

  const minutes = Math.ceil(wordCount / READING_SPEED_WPM);
  return Math.max(1, minutes); // Mínimo 1 minuto
};

export const useEditorStats = (
  text: Ref<string>,
): { stats: ComputedRef<EditorStats> } => {
  const stats = computed(() => {
    const textValue = text.value ?? "";

    const words = countWords(textValue);
    const characters = countCharacters(textValue);
    const paragraphs = countParagraphs(textValue);
    const readingTimeMinutes = calculateReadingTime(words);

    return {
      words,
      characters,
      paragraphs,
      readingTimeMinutes,
    };
  });

  return {
    stats,
  };
};
