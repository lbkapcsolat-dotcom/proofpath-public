import { TRAINING_SET, HOLDOUT_SET, trainSoftmax, predict } from "./model.js";
import { FALSIFICATION_SET, evaluateFalsification } from "./falsification-set.js";

const model=trainSoftmax(TRAINING_SET);
const claimEl=document.querySelector("#claim");
const evidenceEl=document.querySelector("#evidence");
const form=document.querySelector("#proofForm");
const resultEl=document.querySelector("#result");
const probsEl=document.querySelector("#probabilities");
const explanationEl=document.querySelector("#explanation");
const exampleSelect=document.querySelector("#exampleSelect");
const modelStatus=document.querySelector("#modelStatus");
const falsificationSummary=document.querySelector("#falsificationSummary");
const falsificationCases=document.querySelector("#falsificationCases");
const counterexampleButton=document.querySelector("#counterexampleButton");

function pct(x){return `${(x*100).toFixed(1)}%`;}
function explain(label){
  if(label==="SUPPORTED") return "The supplied evidence has enough matching support signals for this compact classifier to place the pair in the SUPPORTED class.";
  if(label==="CONTRADICTED") return "The supplied evidence contains strong conflict signals, such as negation, opposite terms, or incompatible numeric information.";
  return "The evidence does not clearly support or contradict the claim. ProofPath keeps the conclusion conservative instead of forcing a yes/no answer.";
}
function learning(label){
  if(label==="SUPPORTED") return "Learning step: ask whether an independent source supports the same claim.";
  if(label==="CONTRADICTED") return "Learning step: identify the exact word, number, or relation that conflicts with the claim.";
  return "Learning step: name the missing evidence that would make the claim testable.";
}
export function analyze(claim,evidence){
  if(!claim.trim()) return {status:"BLOCK",message:"Add a claim first."};
  if(!evidence.trim()) return {status:"BLOCK",message:"Add evidence first."};
  return {status:"READY",...predict(model,claim,evidence)};
}
function render(out){
  if(out.status==="BLOCK"){resultEl.textContent="BLOCK";probsEl.textContent="";explanationEl.textContent=out.message;return;}
  resultEl.textContent=out.label;
  const p=out.probabilities;
  probsEl.textContent=`SUPPORTED ${pct(p.SUPPORTED)} · CONTRADICTED ${pct(p.CONTRADICTED)} · INSUFFICIENT ${pct(p.INSUFFICIENT)}`;
  explanationEl.innerHTML=`<p>${explain(out.label)}</p><p><strong>${learning(out.label)}</strong></p>`;
}
export function renderFalsification(){
  const rows=evaluateFalsification(model,predict);
  const failures=rows.filter(row=>!row.pass);
  falsificationSummary.textContent=`${rows.length-failures.length}/${rows.length} source-backed cases match the expected evidence relation · ${failures.length} counterexample${failures.length===1?"":"s"} exposed`;
  falsificationCases.innerHTML=rows.map(row=>`
    <article class="case ${row.pass?"case-pass":"case-fail"}">
      <div class="case-kicker">${row.pass?"MATCH":"COUNTEREXAMPLE"} · expected ${row.expected} · model ${row.predicted}</div>
      <strong>${row.claim}</strong>
      <p>${row.evidence}</p>
      <a href="${row.source_url}" target="_blank" rel="noreferrer">${row.source_name}</a>
    </article>`).join("");
  return rows;
}
export function loadCounterexample(){
  const row=evaluateFalsification(model,predict).find(item=>!item.pass);
  if(!row)return;
  claimEl.value=row.claim;
  evidenceEl.value=row.evidence;
  render(analyze(row.claim,row.evidence));
  document.querySelector("#result").scrollIntoView({behavior:"smooth",block:"center"});
}
form.addEventListener("submit",e=>{e.preventDefault();render(analyze(claimEl.value,evidenceEl.value));});
HOLDOUT_SET.forEach((demo,i)=>{
  const o=document.createElement("option");o.value=String(i);o.textContent=`${demo.label}: ${demo.claim}`;exampleSelect.appendChild(o);
});
exampleSelect.addEventListener("change",()=>{
  const demo=HOLDOUT_SET[Number(exampleSelect.value)];
  if(!demo)return;claimEl.value=demo.claim;evidenceEl.value=demo.evidence;render(analyze(demo.claim,demo.evidence));
});
counterexampleButton.addEventListener("click",loadCounterexample);
modelStatus.textContent=`Offline ML ready · ${TRAINING_SET.length} training pairs · ${HOLDOUT_SET.length} untouched holdout/demo pairs · ${FALSIFICATION_SET.length} source-backed falsification cases · no API · no CDN · no account`;
renderFalsification();
