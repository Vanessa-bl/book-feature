import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
  type Ref,
} from "vue";
import type { WritingSession } from "@/types/writing";

const IDLE_TIMEOUT = 1 * 60 * 1000;
const DEBOUNCE_DELAY = 500;
const IDLE_CHECK_INTERVAL = 10 * 1000;
const MAX_SESSIONS = 100;

interface ActiveSession {
  start: number;
  lastActivity: number;
  lastWordCount: number;
  words: number;
}

export const useWritingVelocity = (sessions: Ref<WritingSession[]>) => {
  const activeSession = ref<ActiveSession | null>(null);
  const nowTick = ref(Date.now());
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let idleChecker: ReturnType<typeof setInterval> | null = null;

  const isValidInput = (timestamp: number, wordCount: number): boolean => {
    return (
      Number.isFinite(timestamp) &&
      Number.isFinite(wordCount) &&
      timestamp >= 0 &&
      wordCount >= 0
    );
  };

  const persistSession = () => {
    const session = activeSession.value;

    if (!session || session.words === 0) {
      return;
    }

    const snapshot: WritingSession = {
      start: session.start,
      end: session.lastActivity,
      words: session.words,
    };

    const index = sessions.value.findIndex((s) => s.start === session.start);

    if (index >= 0) {
      sessions.value[index] = snapshot;
    } else {
      sessions.value.push(snapshot);
    }

    if (sessions.value.length > MAX_SESSIONS) {
      sessions.value = sessions.value.slice(-MAX_SESSIONS);
    }
  };

  const saveSession = () => {
    persistSession();
    activeSession.value = null;
  };

  const startSession = (timestamp: number, wordCount: number) => {
    activeSession.value = {
      start: timestamp,
      lastActivity: timestamp,
      lastWordCount: wordCount,
      words: 0,
    };
  };

  const updateSession = (timestamp: number, wordCount: number) => {
    if (!isValidInput(timestamp, wordCount)) {
      console.warn("[useWritingVelocity] Invalid input to updateSession", {
        timestamp,
        wordCount,
      });
      return;
    }

    nowTick.value = timestamp;

    const session = activeSession.value;

    if (!session) {
      startSession(timestamp, wordCount);
      return;
    }

    const inactiveTime = timestamp - session.lastActivity;

    if (inactiveTime > IDLE_TIMEOUT) {
      saveSession();
      startSession(timestamp, wordCount);
      return;
    }

    const wordsAdded = wordCount - session.lastWordCount;

    if (wordsAdded > 0) {
      session.words += wordsAdded;
    }

    session.lastWordCount = wordCount;
    session.lastActivity = timestamp;
  };

  const onTextChange = (wordCount: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      updateSession(Date.now(), wordCount);
      debounceTimer = null;
    }, DEBOUNCE_DELAY);
  };

  const bestHour = computed(() => {
    const active = activeSession.value;
    const currentTime = nowTick.value;

    const allSessions = [
      ...sessions.value.filter((s) => s.start !== active?.start),
      ...(active
        ? [
            {
              start: active.start,
              end: currentTime,
              words: active.words,
            },
          ]
        : []),
    ];

    const grouped = allSessions.reduce<
      Record<number, { words: number; minutes: number }>
    >((acc, session) => {
      const minutes = (session.end - session.start) / 1000 / 60;

      if (minutes <= 0) {
        return acc;
      }

      const hour = new Date(session.start).getHours();

      acc[hour] ??= { words: 0, minutes: 0 };

      acc[hour].words += session.words;
      acc[hour].minutes += minutes;

      return acc;
    }, {});

    const best =
      Object.entries(grouped)
        .filter(([, data]) => data.minutes >= 1)
        .map(([hour, data]) => ({
          hour: Number(hour),
          wordsPerHour: Math.round((data.words / data.minutes) * 60),
          minutes: Math.round(data.minutes),
        }))
        .sort((a, b) => b.wordsPerHour - a.wordsPerHour)[0] ?? null;

    return best;
  });

  const handleBeforeUnload = () => {
    saveSession();
  };

  onMounted(() => {
    idleChecker = setInterval(() => {
      nowTick.value = Date.now();

      const session = activeSession.value;

      if (!session) {
        return;
      }

      const inactiveTime = Date.now() - session.lastActivity;

      if (inactiveTime > IDLE_TIMEOUT) {
        saveSession();
      } else {
        persistSession();
      }
    }, IDLE_CHECK_INTERVAL);

    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    saveSession();
  });

  onUnmounted(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (idleChecker) {
      clearInterval(idleChecker);
      idleChecker = null;
    }

    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  return {
    onTextChange,
    bestHour,
  };
};
