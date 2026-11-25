// One Line, One Laugh — make.fun entry
//
// The program writes exactly one funny line to /output/entry.txt.
// The line is a single self-contained joke: a programmer so certain he
// was right that the tiny sliver of doubt he had left went and filed
// the bug report against him. The laugh lands on the reversal —
// confidence does not win the argument, the 2% does — and the line
// stays tight: two short sentences, one concrete image, nothing to trim.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "I was 98% sure I was right. The other 2% filed the bug report.";

const OUT_PATH = "/output/entry.txt";

// The sealed gate accepts UTF-8 text of 1 to 140 characters, not only
// whitespace. Count in characters, the way the gate does.
const charCount = [...JOKE].length;
if (charCount < 1 || charCount > 140) {
  throw new Error(`Joke must be 1-140 characters, got ${charCount}`);
}
if (JOKE.trim().length === 0) {
  throw new Error("Joke must not be only whitespace");
}

// One line means one line: no line breaks anywhere in the text.
if (/[\r\n]/.test(JOKE)) {
  throw new Error("Joke must be a single line with no line breaks");
}

// The joke must be whole on its own: a complete sentence, ending with a
// full stop, so the judge reads a finished line and nothing dangles.
if (!JOKE.endsWith(".")) {
  throw new Error("Joke must end with a full stop");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JOKE, "utf8");

// Guard: read the file back and prove it is byte-for-byte the joke —
// no trailing newline, no encoding surprise, nothing added or lost.
// A mismatch here must fail loudly instead of shipping a wrong entry.
const written = readFileSync(OUT_PATH, "utf8");
if (written !== JOKE) {
  throw new Error(
    `Output mismatch: file holds ${[...written].length} characters, expected ${charCount}`,
  );
}
if (/[\r\n]/.test(written)) {
  throw new Error("Output must be exactly one line");
}
console.log(`Wrote ${charCount} characters to ${OUT_PATH}`);
