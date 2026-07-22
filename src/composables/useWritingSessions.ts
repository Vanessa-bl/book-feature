import { ref, watch } from "vue";
import type { WritingSession } from "@/types/writing";

const STORAGE_KEY = "writing-sessions";

const loadSessions = (): WritingSession[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      console.warn(
        "[useWritingSessions] Invalid format in localStorage, clearing",
      );
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "[useWritingSessions] Error loading sessions from localStorage:",
      error,
    );
    return [];
  }
};

export const useWritingSessions = () => {
  const sessions = ref<WritingSession[]>(loadSessions());

  watch(
    sessions,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        console.error(
          "[useWritingSessions] Error saving sessions to localStorage:",
          error,
        );
      }
    },
    { deep: true, flush: "sync" },
  );

  const cleanupOldSessions = () => {
    if (sessions.value.length > 100) {
      sessions.value = sessions.value.slice(-100);
    }
  };

  return {
    sessions,
    cleanupOldSessions,
  };
};
