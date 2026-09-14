export const ATTEMPT_VERSION = 2 as const;
export const ATTEMPT_KEY_PREFIX = "pdvl:v2:attempt:";
export const ACTIVE_SESSION_KEY = "pdvl:v2:active-session";

export type AttemptStatus = "in-progress" | "submitted";
export type SubmissionMode = "manual" | "auto";

export interface AttemptRecordV2 {
  version: typeof ATTEMPT_VERSION;
  attemptId: string;
  paper: string;
  module: string;
  seed: string;
  startedAt: number;
  expiresAt: number;
  updatedAt: number;
  currentQuestion: number;
  answers: Array<number | null>;
  status: AttemptStatus;
  submittedAt?: number;
  submissionMode?: SubmissionMode;
  score?: number;
}

export type AttemptContext = Pick<AttemptRecordV2, "paper" | "module" | "seed">;

export type AttemptStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem" | "key" | "length"
>;

function getBrowserStorage(): AttemptStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function dispatchAttemptChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("pdvl-attempt-change"));
  }
}

export function getAttemptStorageKey(attemptId: string) {
  return `${ATTEMPT_KEY_PREFIX}${attemptId}`;
}

export function parseAttemptRecord(
  value: string | null,
): AttemptRecordV2 | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AttemptRecordV2>;
    if (
      parsed.version !== ATTEMPT_VERSION ||
      typeof parsed.attemptId !== "string" ||
      typeof parsed.paper !== "string" ||
      typeof parsed.module !== "string" ||
      typeof parsed.seed !== "string" ||
      typeof parsed.startedAt !== "number" ||
      typeof parsed.expiresAt !== "number" ||
      typeof parsed.updatedAt !== "number" ||
      typeof parsed.currentQuestion !== "number" ||
      !Array.isArray(parsed.answers) ||
      !parsed.answers.every(
        (answer) => answer === null || Number.isInteger(answer),
      ) ||
      (parsed.status !== "in-progress" && parsed.status !== "submitted")
    ) {
      return null;
    }

    return parsed as AttemptRecordV2;
  } catch {
    return null;
  }
}

export function readAttempt(
  attemptId: string,
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  return parseAttemptRecord(
    storage?.getItem(getAttemptStorageKey(attemptId)) ?? null,
  );
}

export function writeAttempt(
  record: AttemptRecordV2,
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return;
  }

  storage.setItem(
    getAttemptStorageKey(record.attemptId),
    JSON.stringify(record),
  );
  storage.setItem(ACTIVE_SESSION_KEY, record.attemptId);
  dispatchAttemptChange();
}

export function removeActiveSession(
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return;
  }

  storage.removeItem(ACTIVE_SESSION_KEY);
  dispatchAttemptChange();
}

export function removeAttempt(
  attemptId: string,
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return;
  }

  storage.removeItem(getAttemptStorageKey(attemptId));
  if (storage.getItem(ACTIVE_SESSION_KEY) === attemptId) {
    storage.removeItem(ACTIVE_SESSION_KEY);
  }
  dispatchAttemptChange();
}

export function readActiveAttempt(
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  const attemptId = storage?.getItem(ACTIVE_SESSION_KEY);
  return attemptId ? readAttempt(attemptId, storage) : null;
}

export function listAttempts(
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return [];
  }

  const attempts: AttemptRecordV2[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(ATTEMPT_KEY_PREFIX)) {
      continue;
    }

    const attempt = parseAttemptRecord(storage.getItem(key));
    if (attempt) {
      attempts.push(attempt);
    }
  }

  return attempts;
}

export function isResumableAttempt(
  record: AttemptRecordV2 | null,
  now = Date.now(),
) {
  return record?.status === "in-progress" && record.expiresAt > now;
}

export function matchesAttemptContext(
  record: AttemptRecordV2 | null,
  context: AttemptContext,
) {
  return Boolean(
    record &&
      record.paper === context.paper &&
      record.module === context.module &&
      record.seed === context.seed,
  );
}

export function getLatestResumableAttempt(
  now = Date.now(),
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  const activeAttempt = readActiveAttempt(storage);
  return isResumableAttempt(activeAttempt, now) ? activeAttempt : null;
}

export function getLatestAttempt(
  matcher: (attempt: AttemptRecordV2) => boolean,
  storage: AttemptStorage | null = getBrowserStorage(),
) {
  return (
    listAttempts(storage)
      .filter(matcher)
      .sort((left, right) => right.updatedAt - left.updatedAt)[0] ?? null
  );
}

export function createAttemptRecord({
  paper,
  module,
  seed,
  total,
  minutes,
  now = Date.now(),
}: {
  paper: string;
  module: string;
  seed: string;
  total: number;
  minutes: number;
  now?: number;
}): AttemptRecordV2 {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const attemptId = `${paper}-${module}-${seed}-${now.toString(36)}-${randomPart}`;

  return {
    version: ATTEMPT_VERSION,
    attemptId,
    paper,
    module,
    seed,
    startedAt: now,
    expiresAt: now + minutes * 60_000 + 3_000,
    updatedAt: now,
    currentQuestion: 0,
    answers: Array.from({ length: total }, () => null),
    status: "in-progress",
  };
}
