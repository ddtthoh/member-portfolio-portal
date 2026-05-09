#!/usr/bin/env node
// Test the AI refactor on one file only.
import { spawn } from "node:child_process";
process.env.LIMIT = "1";
import("./refactor-i18n.mjs");
