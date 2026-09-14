import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const agentStateScript = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "agent-state",
);

test("reports its version through the supported version flags", () => {
  for (const flag of ["--version", "-v", "version"]) {
    const output = execFileSync(agentStateScript, [flag], {
      encoding: "utf8",
    }).trim();

    assert.strictEqual(output, "agent-state v1.0.0");
  }
});

function createTempDir(prefix = "agent-state-test-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function initGitRepo(dir) {
  execFileSync("git", ["init", "-b", "main", dir], { stdio: "ignore" });
  execFileSync("git", ["config", "user.name", "Test User"], {
    cwd: dir,
    stdio: "ignore",
  });
  execFileSync("git", ["config", "user.email", "test@example.com"], {
    cwd: dir,
    stdio: "ignore",
  });
}

test("fails with useful error when run outside a git repository", () => {
  const tempDir = createTempDir("non-git-");
  try {
    let error;
    try {
      execFileSync(agentStateScript, ["issue", "reserve"], {
        cwd: tempDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      error = err;
    }

    assert.ok(error, "Expected command to fail outside git repo");
    assert.strictEqual(error.status, 1);
    assert.match(
      error.stderr,
      /Ensure you are running inside a Git repository/i,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("allocates 001 on fresh repository with no issues", () => {
  const tempDir = createTempDir("fresh-git-");
  try {
    initGitRepo(tempDir);

    const output = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();

    assert.strictEqual(output, "001");

    const dbPath = path.join(tempDir, ".git", "agent", "state.sqlite");
    assert.ok(
      fs.existsSync(dbPath),
      "Database must be created in .git/agent/state.sqlite",
    );

    // Ensure working tree is clean
    const workingTreeFiles = fs.readdirSync(tempDir);
    assert.deepStrictEqual(workingTreeFiles, [".git"]);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("accounts for existing numbered issues in tasks subdirectories", () => {
  const tempDir = createTempDir("existing-issues-");
  try {
    initGitRepo(tempDir);

    // Create tasks in multiple lifecycle directories
    fs.mkdirSync(path.join(tempDir, "tasks", "completed"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "tasks", "in-progress"), {
      recursive: true,
    });
    fs.mkdirSync(path.join(tempDir, "tasks", "in-review"), { recursive: true });
    fs.mkdirSync(path.join(tempDir, "tasks", "backlog"), { recursive: true });

    fs.writeFileSync(
      path.join(tempDir, "tasks", "completed", "ISSUE-001-audit.md"),
      "# Task 1",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "completed", "BUG-015-resume-fix.md"),
      "# Bug 15",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "in-review", "RESEARCH-020-routing.md"),
      "# Research 20",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "in-progress", "TASK-025-nav.md"),
      "# Task 25",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", "ISSUE-034-config.md"),
      "# Task 34",
    );

    const output1 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(output1, "035");

    const output2 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(output2, "036");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("reconciles when repository issues are ahead of local SQLite sequence", () => {
  const tempDir = createTempDir("reconcile-");
  try {
    initGitRepo(tempDir);

    // Initial reservation with no issues
    const res1 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(res1, "001");

    // Simulate pulling newer commits from main that contain ISSUE-050
    fs.mkdirSync(path.join(tempDir, "tasks", "backlog"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", "ISSUE-050-upstream-task.md"),
      "# Upstream Task",
    );

    // Next reserve must reconcile and jump to 051
    const res2 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(res2, "051");

    const res3 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(res3, "052");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("reports useful error for materially malformed issue filenames", () => {
  const tempDir = createTempDir("malformed-");
  try {
    initGitRepo(tempDir);

    fs.mkdirSync(path.join(tempDir, "tasks", "backlog"), { recursive: true });
    fs.writeFileSync(
      path.join(
        tempDir,
        "tasks",
        "backlog",
        "ISSUE-invalidnumber-something.md",
      ),
      "# Invalid",
    );

    let error;
    try {
      execFileSync(agentStateScript, ["issue", "reserve"], {
        cwd: tempDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      error = err;
    }

    assert.ok(error, "Expected command to fail on malformed issue filename");
    assert.strictEqual(error.status, 1);
    assert.match(error.stderr, /Malformed issue filename/i);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("multiple Git worktrees share the same coordination database", () => {
  const mainDir = createTempDir("worktree-main-");
  const worktreeDir = createTempDir("worktree-wt-");
  try {
    initGitRepo(mainDir);

    // Commit a file so a branch exists for worktree
    fs.writeFileSync(path.join(mainDir, "README.md"), "# Test");
    execFileSync("git", ["add", "."], { cwd: mainDir, stdio: "ignore" });
    execFileSync("git", ["commit", "-m", "initial commit"], {
      cwd: mainDir,
      stdio: "ignore",
    });

    // Create a worktree
    execFileSync("git", ["worktree", "add", worktreeDir, "-b", "feature"], {
      cwd: mainDir,
      stdio: "ignore",
    });

    // Reserve in main repo
    const num1 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: mainDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(num1, "001");

    // Reserve in worktree repo - must see sequence from shared db
    const num2 = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: worktreeDir,
      encoding: "utf8",
    }).trim();
    assert.strictEqual(num2, "002");

    // Ensure database is in main .git/agent/state.sqlite and not inside worktree working copy
    assert.ok(
      fs.existsSync(path.join(mainDir, ".git", "agent", "state.sqlite")),
    );
    assert.ok(!fs.existsSync(path.join(worktreeDir, "state.sqlite")));
  } finally {
    try {
      execFileSync("git", ["worktree", "remove", "--force", worktreeDir], {
        cwd: mainDir,
        stdio: "ignore",
      });
    } catch {
      // Ignore worktree remove error on cleanup
    }
    fs.rmSync(worktreeDir, { recursive: true, force: true });
    fs.rmSync(mainDir, { recursive: true, force: true });
  }
});

test("handles 4-digit issue numbers correctly without truncating", () => {
  const tempDir = createTempDir("four-digit-");
  try {
    initGitRepo(tempDir);

    fs.mkdirSync(path.join(tempDir, "tasks", "backlog"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", "ISSUE-1000-large-issue.md"),
      "# Task 1000",
    );

    const output = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();

    assert.strictEqual(output, "1001");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("ignores non-issue markdown and system files", () => {
  const tempDir = createTempDir("ignored-files-");
  try {
    initGitRepo(tempDir);

    fs.mkdirSync(path.join(tempDir, "tasks", "backlog"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", "README.md"),
      "# Tasks Readme",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", "template.md"),
      "# Template",
    );
    fs.writeFileSync(
      path.join(tempDir, "tasks", "backlog", ".DS_Store"),
      "junk",
    );

    const output = execFileSync(agentStateScript, ["issue", "reserve"], {
      cwd: tempDir,
      encoding: "utf8",
    }).trim();

    assert.strictEqual(output, "001");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test("prints usage on --help and fails on unknown command", () => {
  const helpOutput = execFileSync(agentStateScript, ["--help"], {
    encoding: "utf8",
  });
  assert.match(helpOutput, /Usage: scripts\/agent-state <command>/);

  let error;
  try {
    execFileSync(agentStateScript, ["invalid", "action"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    error = err;
  }

  assert.ok(error, "Expected command to fail on unknown subcommand");
  assert.strictEqual(error.status, 1);
  assert.match(error.stderr, /Unknown command: invalid action/);
});

test("handles concurrent reservations without duplicates or race conditions", async () => {
  const tempDir = createTempDir("concurrency-");
  try {
    initGitRepo(tempDir);

    const CONCURRENT_COUNT = 25;
    const promises = [];

    for (let i = 0; i < CONCURRENT_COUNT; i++) {
      promises.push(
        execFileAsync(agentStateScript, ["issue", "reserve"], {
          cwd: tempDir,
          encoding: "utf8",
        }),
      );
    }

    const results = await Promise.all(promises);
    const allocated = results.map((r) => r.stdout.trim());

    assert.strictEqual(allocated.length, CONCURRENT_COUNT);

    // Verify all returned values are unique
    const uniqueAllocated = new Set(allocated);
    assert.strictEqual(
      uniqueAllocated.size,
      CONCURRENT_COUNT,
      `Expected ${CONCURRENT_COUNT} unique numbers, but got duplicates: ${JSON.stringify(allocated)}`,
    );

    // Verify the set of allocated numbers is exactly 001..025
    const numbers = allocated.map((s) => parseInt(s, 10)).sort((a, b) => a - b);
    for (let i = 0; i < CONCURRENT_COUNT; i++) {
      assert.strictEqual(numbers[i], i + 1);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
