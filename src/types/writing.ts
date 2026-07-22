export interface WritingSession {
  start: number;
  end: number;
  words: number;
}

export const isValidWritingSession = (obj: unknown): obj is WritingSession => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const session = obj as Record<string, unknown>;

  return (
    typeof session.start === "number" &&
    typeof session.end === "number" &&
    typeof session.words === "number" &&
    session.start >= 0 &&
    session.end >= session.start &&
    session.words >= 0 &&
    Number.isFinite(session.start) &&
    Number.isFinite(session.end) &&
    Number.isFinite(session.words)
  );
};

export const getSessionDuration = (session: WritingSession): number => {
  const ms = session.end - session.start;
  return Math.round(ms / 1000 / 60);
};

export const getSessionVelocity = (session: WritingSession): number => {
  const minutes = getSessionDuration(session);
  if (minutes <= 0) {
    return 0;
  }
  return Math.round((session.words / minutes) * 60);
};
