import { ref, computed, readonly, type Ref, type ComputedRef } from "vue";
import type { Chapter } from "@/types/chapter";

export interface UseChaptersReturn {
  chapters: Readonly<Ref<Chapter[]>>;
  activeChapter: ComputedRef<Chapter | undefined>;
  activeChapterId: Ref<string>;
  updateTitle: (id: string, title: string) => void;
  updateContent: (id: string, content: string) => void;
}

const chapters = ref<Chapter[]>([{ id: "1", title: "Chapter 1", content: "" }]);
const activeChapterId = ref<string>("1");

export function useChapters(): UseChaptersReturn {
  const activeChapter = computed(() =>
    chapters.value.find((c) => c.id === activeChapterId.value),
  );

  const updateTitle = (id: string, title: string) => {
    const chapter = chapters.value.find((c) => c.id === id);
    if (chapter) chapter.title = title;
  };

  const updateContent = (id: string, content: string) => {
    const chapter = chapters.value.find((c) => c.id === id);
    if (chapter) chapter.content = content;
  };

  return {
    chapters: readonly(chapters) as Readonly<Ref<Chapter[]>>,
    activeChapter,
    activeChapterId,
    updateTitle,
    updateContent,
  };
}
