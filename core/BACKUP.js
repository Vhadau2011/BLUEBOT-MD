"use strict";

/*
 * BLUEBOT-MD – FILE INTEGRITY GUARD
 * Any modification will break execution.
 */

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

if (!global.__BLUEBOT_LOCKED__) {
  console.error("Security chain broken. REPO_RULES not loaded.");
  process.exit(1);
}

// Files to protect
const PROTECTED_FILES = [
  "index.js",
  "core/REPO_RULES.js",
  "core/BACKUP.js"
];

// Stored hashes (generate ONCE, never change)
const HASHES = {
  "index.js": "REPLACE_WITH_HASH",
  "core/REPO_RULES.js": "REPLACE_WITH_HASH",
  "core/BACKUP.js": "REPLACE_WITH_HASH"
};

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

for (const file of PROTECTED_FILES) {
  const fullPath = path.join(process.cwd(), file);

  if (!fs.existsSync(fullPath)) {
    console.error(`Protected file deleted: ${file}`);
    process.exit(1);
  }

  const currentHash = hashFile(fullPath);

  if (HASHES[file] !== "REPLACE_WITH_HASH" && currentHash !== HASHES[file]) {
    console.error(`File tampering detected: ${file}`);
    process.exit(1);
  }
}

module.exports = true;
