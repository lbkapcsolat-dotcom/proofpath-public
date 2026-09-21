import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("./index.html","utf8");
const app=fs.readFileSync("./app.js","utf8");

for(const s of [
  'id="claim"',
  'id="evidence"',
  'id="exampleSelect"',
  'id="modelStatus"',
  'EDUCATIONAL_EVIDENCE_ASSESSMENT_ONLY'
]) assert.match(html,new RegExp(s));

for(const s of [
  'id="judgePath"',
  'id="falsificationSummary"',
  'id="falsificationCases"',
  'id="counterexampleButton"'
]) assert.match(html,new RegExp(s),`Missing judge-first UI seam: ${s}`);

assert.match(app,/trainSoftmax/);
assert.match(app,/HOLDOUT_SET/);
assert.match(app,/export function analyze/);
assert.match(app,/FALSIFICATION_SET/, "Judge layer must consume the separate falsification set.");
assert.match(app,/renderFalsification/, "Judge layer must render falsification results.");
assert.match(app,/loadCounterexample/, "Judge layer must expose a counterexample action.");

console.log("PASS: judge-first submission UI static checks");
