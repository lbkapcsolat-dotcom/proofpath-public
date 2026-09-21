import assert from "node:assert/strict";
import { TRAINING_SET, trainSoftmax, predict } from "./model.js";
import { FALSIFICATION_SET, evaluateFalsification } from "./falsification-set.js";

assert.equal(FALSIFICATION_SET.length, 6, "Expected six bounded source-backed cases.");
for (const item of FALSIFICATION_SET) {
  assert.ok(["SUPPORTED","CONTRADICTED","INSUFFICIENT"].includes(item.expected));
  assert.match(item.source_url, /^https:\/\//);
  assert.ok(item.source_name.length > 3);
  assert.ok(item.claim.length > 5);
  assert.ok(item.evidence.length > 5);
}

const model = trainSoftmax(TRAINING_SET);
const results = evaluateFalsification(model, predict);
const counterexamples = results.filter(row => !row.pass);

for (const row of results) {
  assert.equal(row.claim_ceiling, "EDUCATIONAL_EVIDENCE_ASSESSMENT_ONLY");
}
assert.ok(counterexamples.length >= 1, "The falsification surface must expose at least one real counterexample rather than imply perfect generalization.");

console.log(JSON.stringify({
  passed: results.length - counterexamples.length,
  total: results.length,
  counterexamples: counterexamples.map(({id, expected, predicted}) => ({id, expected, predicted}))
}, null, 2));
