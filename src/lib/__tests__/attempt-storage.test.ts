import {
  ACTIVE_SESSION_KEY,
  type AttemptRecordV2,
  type AttemptStorage,
  createAttemptRecord,
  getLatestResumableAttempt,
  listAttempts,
  matchesAttemptContext,
  parseAttemptRecord,
  readActiveAttempt,
  readAttempt,
  removeAttempt,
  writeAttempt,
} from "../attempt-storage";

type StorageFailure = "getItem" | "setItem" | "removeItem";

function createStorage(initial: Record<string, string> = {}, failure?: StorageFailure): AttemptStorage {
  const values = new Map(Object.entries(initial));
  const fail = (method: StorageFailure) => {
    if (failure === method) {
      const error = new Error(`${method} failed`);
      error.name = method === "setItem" ? "QuotaExceededError" : "SecurityError";
      throw error;
    }
  };

  return {
    get length() {
      return values.size;
    },
    getItem(key) {
      fail("getItem");
      return values.get(key) ?? null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      fail("removeItem");
      values.delete(key);
    },
    setItem(key, value) {
      fail("setItem");
      values.set(key, value);
    },
  };
}

function attempt(overrides: Partial<AttemptRecordV2> = {}): AttemptRecordV2 {
  return {
    ...createAttemptRecord({
      paper: "b",
      module: "3b",
      seed: "abc123",
      total: 2,
      minutes: 30,
      now: 1_000,
    }),
    ...overrides,
  };
}

function serializedAttempt(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({ ...attempt(), ...overrides });
}

describe("attempt storage v2", () => {
  it("creates a valid empty attempt with a three-second grace allowance", () => {
    const record = createAttemptRecord({
      paper: "a",
      module: "m1",
      seed: "abc123",
      total: 3,
      minutes: 35,
      now: 10_000,
    });

    expect(record.version).toBe(2);
    expect(record.status).toBe("in-progress");
    expect(record.answers).toEqual([null, null, null]);
    expect(record.expiresAt).toBe(10_000 + 35 * 60_000 + 3_000);
  });

  it("uses the most recently updated unfinished attempt and ignores old or expired records", () => {
    const storage = createStorage({
      "pdvl:old:record": JSON.stringify(attempt({ attemptId: "old", updatedAt: 99_999 })),
      "pdvl:v2:attempt:expired": JSON.stringify(attempt({ attemptId: "expired", expiresAt: 10, updatedAt: 90 })),
    });
    writeAttempt(attempt({ attemptId: "older", updatedAt: 100, expiresAt: 5_000 }), storage);
    writeAttempt(attempt({ attemptId: "latest", updatedAt: 200, expiresAt: 5_000 }), storage);

    expect(getLatestResumableAttempt(1_000, storage)?.attemptId).toBe("latest");
    expect(listAttempts(storage)).toHaveLength(3);
  });

  it("does not fall back to another record after the active pointer is cleared", () => {
    const storage = createStorage();
    writeAttempt(attempt({ attemptId: "first", updatedAt: 100, expiresAt: 5_000 }), storage);
    writeAttempt(attempt({ attemptId: "second", updatedAt: 200, expiresAt: 5_000 }), storage);
    storage.removeItem(ACTIVE_SESSION_KEY);

    expect(getLatestResumableAttempt(1_000, storage)).toBeNull();
  });

  it("deletes the targeted v2 attempt and its active pointer without touching another attempt", () => {
    const storage = createStorage();
    const target = attempt({ attemptId: "target" });
    const other = attempt({ attemptId: "other", updatedAt: 200 });
    writeAttempt(target, storage);
    writeAttempt(other, storage);
    storage.setItem(ACTIVE_SESSION_KEY, target.attemptId);

    removeAttempt(target.attemptId, storage);

    expect(storage.getItem("pdvl:v2:attempt:target")).toBeNull();
    expect(storage.getItem(ACTIVE_SESSION_KEY)).toBeNull();
    expect(readActiveAttempt(storage)).toBeNull();
    expect(storage.getItem("pdvl:v2:attempt:other")).not.toBeNull();
  });

  it("does not treat submitted records as resumable", () => {
    const storage = createStorage();
    writeAttempt(
      attempt({
        attemptId: "submitted",
        status: "submitted",
        updatedAt: 1_500,
        submittedAt: 1_500,
        submissionMode: "manual",
      }),
      storage,
    );

    expect(getLatestResumableAttempt(1_000, storage)).toBeNull();
    expect(readActiveAttempt(storage)?.attemptId).toBe("submitted");
    expect(storage.getItem(ACTIVE_SESSION_KEY)).toBe("submitted");
  });

  it("matches an attempt only when its paper, module, and seed match the route", () => {
    const record = attempt({ paper: "a", module: "m1", seed: "abc123" });

    expect(
      matchesAttemptContext(record, {
        paper: "a",
        module: "m1",
        seed: "abc123",
      }),
    ).toBe(true);
    expect(
      matchesAttemptContext(record, {
        paper: "a",
        module: "m1",
        seed: "ABC123",
      }),
    ).toBe(false);
    expect(
      matchesAttemptContext(record, {
        paper: "a",
        module: "m2",
        seed: "abc123",
      }),
    ).toBe(false);
    expect(matchesAttemptContext(null, { paper: "a", module: "m1", seed: "abc123" })).toBe(false);
  });

  it("rejects malformed records", () => {
    expect(parseAttemptRecord('{"version":1}')).toBeNull();
    expect(parseAttemptRecord("not json")).toBeNull();
  });

  it("accepts valid in-progress and legacy-compatible submitted records", () => {
    const context = { questionCount: 2, choiceCounts: [4, 4] };
    const submitted = attempt({
      status: "submitted",
      submittedAt: 2_000,
      submissionMode: "auto",
    });

    expect(parseAttemptRecord(JSON.stringify(attempt()), context)).not.toBeNull();
    expect(parseAttemptRecord(JSON.stringify(submitted), context)).toEqual(submitted);
  });

  it("rejects non-finite or negative timestamps", () => {
    expect(parseAttemptRecord(serializedAttempt({ startedAt: Number.POSITIVE_INFINITY }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ expiresAt: Number.NaN }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ updatedAt: -1 }))).toBeNull();
  });

  it("requires consistent submission metadata and score ranges", () => {
    expect(parseAttemptRecord(serializedAttempt({ status: "submitted" }))).toBeNull();
    expect(
      parseAttemptRecord(serializedAttempt({ status: "submitted", submittedAt: 2_000, submissionMode: "unknown" })),
    ).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ submittedAt: 2_000 }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ score: 1 }))).toBeNull();
    expect(
      parseAttemptRecord(
        serializedAttempt({ status: "submitted", submittedAt: 2_000, submissionMode: "manual", score: 3 }),
      ),
    ).toBeNull();
  });

  it("rejects invalid question positions and answer ranges", () => {
    expect(parseAttemptRecord(serializedAttempt({ currentQuestion: -1 }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ currentQuestion: 2 }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ answers: [null, -1] }))).toBeNull();
    expect(parseAttemptRecord(serializedAttempt({ answers: [null, 4] }))).toBeNull();
    expect(
      parseAttemptRecord(serializedAttempt({ answers: [2, null] }), {
        questionCount: 2,
        choiceCounts: [2, 4],
      }),
    ).toBeNull();
    expect(
      parseAttemptRecord(serializedAttempt({ answers: [null] }), {
        questionCount: 2,
        choiceCounts: [4, 4],
      }),
    ).toBeNull();
    expect(
      parseAttemptRecord(serializedAttempt({ answers: [1, null] }), {
        questionCount: 2,
        choiceCounts: [2, 4],
      }),
    ).not.toBeNull();
  });

  it("exposes an expired active attempt for one-time expiry recovery", () => {
    const storage = createStorage();
    const expired = attempt({ attemptId: "expired-active", expiresAt: 999, updatedAt: 900 });
    writeAttempt(expired, storage);

    expect(readActiveAttempt(storage)?.attemptId).toBe(expired.attemptId);
    expect(getLatestResumableAttempt(1_000, storage)).toBeNull();
  });

  it("fails closed when browser storage reads or writes throw", () => {
    expect(() => readAttempt("blocked", createStorage({}, "getItem"))).not.toThrow();
    expect(readAttempt("blocked", createStorage({}, "getItem"))).toBeNull();
    expect(() => readActiveAttempt(createStorage({}, "getItem"))).not.toThrow();
    expect(writeAttempt(attempt(), createStorage({}, "setItem"))).toBe(false);
    expect(() => removeAttempt("attempt", createStorage({}, "removeItem"))).not.toThrow();
  });
});
