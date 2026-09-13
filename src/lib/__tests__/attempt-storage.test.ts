import {
  ACTIVE_SESSION_KEY,
  type AttemptRecordV2,
  type AttemptStorage,
  createAttemptRecord,
  getLatestResumableAttempt,
  listAttempts,
  parseAttemptRecord,
  readActiveAttempt,
  writeAttempt,
} from '../attempt-storage';

function createStorage(initial: Record<string, string> = {}): AttemptStorage {
  const values = new Map(Object.entries(initial));

  return {
    get length() {
      return values.size;
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function attempt(overrides: Partial<AttemptRecordV2> = {}): AttemptRecordV2 {
  return {
    ...createAttemptRecord({ paper: 'b', module: '3b', seed: 'abc123', total: 2, minutes: 30, now: 1_000 }),
    ...overrides,
  };
}

describe('attempt storage v2', () => {
  it('creates a valid empty attempt with a three-second grace allowance', () => {
    const record = createAttemptRecord({ paper: 'a', module: 'm1', seed: 'abc123', total: 3, minutes: 35, now: 10_000 });

    expect(record.version).toBe(2);
    expect(record.status).toBe('in-progress');
    expect(record.answers).toEqual([null, null, null]);
    expect(record.expiresAt).toBe(10_000 + 35 * 60_000 + 3_000);
  });

  it('uses the most recently updated unfinished attempt and ignores old or expired records', () => {
    const storage = createStorage({
      'pdvl:old:record': JSON.stringify(attempt({ attemptId: 'old', updatedAt: 99_999 })),
      'pdvl:v2:attempt:expired': JSON.stringify(attempt({ attemptId: 'expired', expiresAt: 10, updatedAt: 90 })),
    });
    writeAttempt(attempt({ attemptId: 'older', updatedAt: 100, expiresAt: 5_000 }), storage);
    writeAttempt(attempt({ attemptId: 'latest', updatedAt: 200, expiresAt: 5_000 }), storage);

    expect(getLatestResumableAttempt(1_000, storage)?.attemptId).toBe('latest');
    expect(listAttempts(storage)).toHaveLength(3);
  });

  it('does not fall back to another record after the active pointer is cleared', () => {
    const storage = createStorage();
    writeAttempt(attempt({ attemptId: 'first', updatedAt: 100, expiresAt: 5_000 }), storage);
    writeAttempt(attempt({ attemptId: 'second', updatedAt: 200, expiresAt: 5_000 }), storage);
    storage.removeItem(ACTIVE_SESSION_KEY);

    expect(getLatestResumableAttempt(1_000, storage)).toBeNull();
  });

  it('does not treat submitted records as resumable', () => {
    const storage = createStorage();
    writeAttempt(attempt({ attemptId: 'submitted', status: 'submitted', updatedAt: 500 }), storage);

    expect(getLatestResumableAttempt(1_000, storage)).toBeNull();
    expect(readActiveAttempt(storage)?.attemptId).toBe('submitted');
    expect(storage.getItem(ACTIVE_SESSION_KEY)).toBe('submitted');
  });

  it('rejects malformed records', () => {
    expect(parseAttemptRecord('{"version":1}')).toBeNull();
    expect(parseAttemptRecord('not json')).toBeNull();
  });
});
