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
export interface AttemptValidationContext {
  questionCount?: number;
  choiceCounts?: readonly number[];
}

export type AttemptStorage = Pick<Storage, "getItem" | "setItem" | "removeItem" | "key" | "length">;

const MAX_CHOICES = 4;

export function getBrowserStorage(): AttemptStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storage = window.localStorage;
    storage.getItem(ACTIVE_SESSION_KEY);
    return storage;
  } catch {
    return null;
  }
}

function dispatchAttemptChange() {
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("pdvl-attempt-change"));
    }
  } catch {
    // Storage updates should not fail just because the change notification is unavailable.
  }
}

export function getAttemptStorageKey(attemptId: string) {
  return `${ATTEMPT_KEY_PREFIX}${attemptId}`;
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function hasOwn(record: object, key: string) {
  return Object.hasOwn(record, key);
}

export function parseAttemptRecord(
  value: string | null,
  context: AttemptValidationContext = {},
): AttemptRecordV2 | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AttemptRecordV2>;
    const answers = parsed.answers;
    const currentQuestion = parsed.currentQuestion;
    if (
      parsed.version !== ATTEMPT_VERSION ||
      typeof parsed.attemptId !== "string" ||
      parsed.attemptId.length === 0 ||
      typeof parsed.paper !== "string" ||
      parsed.paper.length === 0 ||
      typeof parsed.module !== "string" ||
      parsed.module.length === 0 ||
      typeof parsed.seed !== "string" ||
      parsed.seed.length === 0 ||
      !isFiniteNonNegative(parsed.startedAt) ||
      !isFiniteNonNegative(parsed.expiresAt) ||
      !isFiniteNonNegative(parsed.updatedAt) ||
      typeof currentQuestion !== "number" ||
      !Number.isInteger(currentQuestion) ||
      currentQuestion < 0 ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      !answers.every((answer) => answer === null || Number.isInteger(answer)) ||
      currentQuestion >= answers.length ||
      (context.questionCount !== undefined &&
        (!Number.isInteger(context.questionCount) ||
          context.questionCount <= 0 ||
          answers.length !== context.questionCount)) ||
      (context.choiceCounts !== undefined &&
        (context.choiceCounts.length !== answers.length ||
          !context.choiceCounts.every(
            (choiceCount) => Number.isInteger(choiceCount) && choiceCount >= 2 && choiceCount <= MAX_CHOICES,
          ))) ||
      !answers.every((answer, index) => {
        if (answer === null) {
          return true;
        }

        const choiceCount = context.choiceCounts?.[index] ?? MAX_CHOICES;
        return answer >= 0 && answer < choiceCount;
      }) ||
      (parsed.status !== "in-progress" && parsed.status !== "submitted")
    ) {
      return null;
    }

    if (parsed.status === "submitted") {
      // Keep score optional for older v2 records; results can calculate it from the saved answers.
      if (
        !isFiniteNonNegative(parsed.submittedAt) ||
        (parsed.submissionMode !== "manual" && parsed.submissionMode !== "auto") ||
        (parsed.score !== undefined &&
          (!Number.isInteger(parsed.score) || parsed.score < 0 || parsed.score > answers.length))
      ) {
        return null;
      }
    } else if (hasOwn(parsed, "submittedAt") || hasOwn(parsed, "submissionMode") || hasOwn(parsed, "score")) {
      return null;
    }

    return parsed as AttemptRecordV2;
  } catch {
    return null;
  }
}

function readStorageItem(storage: AttemptStorage | null, key: string) {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function readAttempt(
  attemptId: string,
  storage: AttemptStorage | null = getBrowserStorage(),
  context: AttemptValidationContext = {},
) {
  return parseAttemptRecord(readStorageItem(storage, getAttemptStorageKey(attemptId)), context);
}

export function writeAttempt(record: AttemptRecordV2, storage: AttemptStorage | null = getBrowserStorage()) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(getAttemptStorageKey(record.attemptId), JSON.stringify(record));
    storage.setItem(ACTIVE_SESSION_KEY, record.attemptId);
    dispatchAttemptChange();
    return true;
  } catch {
    return false;
  }
}

export function removeActiveSession(storage: AttemptStorage | null = getBrowserStorage()) {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(ACTIVE_SESSION_KEY);
    dispatchAttemptChange();
    return true;
  } catch {
    return false;
  }
}

export function removeAttempt(attemptId: string, storage: AttemptStorage | null = getBrowserStorage()) {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(getAttemptStorageKey(attemptId));
    if (storage.getItem(ACTIVE_SESSION_KEY) === attemptId) {
      storage.removeItem(ACTIVE_SESSION_KEY);
    }
    dispatchAttemptChange();
    return true;
  } catch {
    return false;
  }
}

export function readActiveAttempt(
  storage: AttemptStorage | null = getBrowserStorage(),
  context: AttemptValidationContext = {},
) {
  const attemptId = readStorageItem(storage, ACTIVE_SESSION_KEY);
  return attemptId ? readAttempt(attemptId, storage, context) : null;
}

export function listAttempts(
  storage: AttemptStorage | null = getBrowserStorage(),
  context: AttemptValidationContext = {},
) {
  if (!storage) {
    return [];
  }

  try {
    const attempts: AttemptRecordV2[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(ATTEMPT_KEY_PREFIX)) {
        continue;
      }

      const attempt = parseAttemptRecord(storage.getItem(key), context);
      if (attempt) {
        attempts.push(attempt);
      }
    }

    return attempts;
  } catch {
    return [];
  }
}

export function isResumableAttempt(record: AttemptRecordV2 | null, now = Date.now()) {
  return record?.status === "in-progress" && record.expiresAt > now;
}

export function matchesAttemptContext(record: AttemptRecordV2 | null, context: AttemptContext) {
  return Boolean(
    record && record.paper === context.paper && record.module === context.module && record.seed === context.seed,
  );
}

export function getLatestResumableAttempt(
  now = Date.now(),
  storage: AttemptStorage | null = getBrowserStorage(),
  context: AttemptValidationContext = {},
) {
  const activeAttempt = readActiveAttempt(storage, context);
  return isResumableAttempt(activeAttempt, now) ? activeAttempt : null;
}

export function getLatestAttempt(
  matcher: (attempt: AttemptRecordV2) => boolean,
  storage: AttemptStorage | null = getBrowserStorage(),
  context: AttemptValidationContext = {},
) {
  return (
    listAttempts(storage, context)
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
