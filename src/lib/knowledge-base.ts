import { readFile } from "node:fs/promises";
import path from "node:path";

// Module-level memoized promise — reads the KB file once per warm instance.
// On error, clears itself so the next request retries.
let cached: Promise<string> | null = null;

export function getKnowledgeContext(): Promise<string> {
  if (!cached) {
    cached = readFile(
      path.join(process.cwd(), "doc", "bits-ai-lab-knowledge-base.md"),
      "utf-8"
    ).catch((err) => {
      cached = null; // allow retry on next request
      throw err;
    });
  }
  return cached;
}
