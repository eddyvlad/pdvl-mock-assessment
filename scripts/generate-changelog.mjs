import { writeFile } from "node:fs/promises";
import { ConventionalChangelog } from "conventional-changelog";

const chunks = [];
const generator = new ConventionalChangelog();

generator.readPackage().loadPreset("conventionalcommits").options({ releaseCount: 0 }).tags({ prefix: "v" });

for await (const chunk of generator.write()) {
  chunks.push(chunk);
}

const changelog = chunks.join("");

if (!changelog.trim()) {
  throw new Error("No Conventional Commit history was found for CHANGELOG.md");
}

await writeFile("CHANGELOG.md", changelog.endsWith("\n") ? changelog : `${changelog}\n`);
