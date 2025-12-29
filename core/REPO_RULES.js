"use strict";

/*
 * BLUEBOT-MD – REPO RULES ENFORCER
 * Trusted Team: ⨺⃝Х
 * Unauthorized modification is strictly forbidden.
 */

const fs = require("fs");
const path = require("path");

const REQUIRED = {
  PROJECT_NAME: "BLUEBOT-MD",
  TRUSTED_TEAM: "⨺⃝Х",
  REQUIRED_FILES: [
    "index.js",
    "package.json",
    "core/BACKUP.js",
    "core/REPO_RULES.js"
  ]
};

function hardExit(reason) {
  console.error("\n[BLUEBOT-MD SECURITY VIOLATION]");
  console.error(reason);
  console.error("Execution halted.\n");
  process.exit(1);
}

// Check package.json
const pkgPath = path.join(process.cwd(), "package.json");
if (!fs.existsSync(pkgPath)) {
  hardExit("package.json missing");
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

// Project name check
if (!pkg.name || pkg.name !== REQUIRED.PROJECT_NAME) {
  hardExit("Project name mismatch or modified");
}

// Author / team trust check
const authorString = JSON.stringify(pkg).toLowerCase();
if (!authorString.includes(REQUIRED.TRUSTED_TEAM.toLowerCase())) {
  hardExit("Trusted ⨺⃝Х team reference removed");
}

// Required files check
for (const file of REQUIRED.REQUIRED_FILES) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    hardExit(`Critical file missing: ${file}`);
  }
}

// Lock confirmation
global.__DARKHEART_LOCKED__ = true;

module.exports = true;
