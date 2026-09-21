export const FALSIFICATION_SET = [
  {
    id: "mars-two-moons",
    expected: "SUPPORTED",
    claim: "Mars has two moons.",
    evidence: "Mars has two small moons, Phobos and Deimos.",
    source_name: "NASA Science — Mars Moons",
    source_url: "https://science.nasa.gov/mars/moons/",
    source_note: "Official NASA planetary reference."
  },
  {
    id: "venus-no-moons",
    expected: "CONTRADICTED",
    claim: "Venus has moons.",
    evidence: "Venus has no moons.",
    source_name: "NASA Science — Venus Facts",
    source_url: "https://science.nasa.gov/venus/venus-facts/",
    source_note: "Official NASA planetary reference."
  },
  {
    id: "sleep-perfect-memory",
    expected: "INSUFFICIENT",
    claim: "A single night of sleep guarantees perfect memory.",
    evidence: "Sleep helps with learning and the formation of long-term memories.",
    source_name: "NIH/NHLBI — Why Sleep Is Important",
    source_url: "https://www.nhlbi.nih.gov/health/sleep/why-sleep-important",
    source_note: "The source supports a role for sleep in memory, not the guarantee in the claim."
  },
  {
    id: "pacific-largest",
    expected: "SUPPORTED",
    claim: "The Pacific is the largest ocean.",
    evidence: "The Pacific is the largest ocean basin on Earth.",
    source_name: "NOAA Ocean Service — Largest Ocean Basin",
    source_url: "https://oceanservice.noaa.gov/facts/biggestocean.html",
    source_note: "Official NOAA ocean reference."
  },
  {
    id: "whales-fish",
    expected: "CONTRADICTED",
    claim: "Whales are fish.",
    evidence: "Whales are mammals.",
    source_name: "NOAA Fisheries — Marine Mammal Taxonomy",
    source_url: "https://www.fisheries.noaa.gov/national/outreach-and-education/marine-mammal-taxonomy",
    source_note: "Deliberately difficult semantic counterexample for the compact lexical model."
  },
  {
    id: "exercise-always-prevents-depression",
    expected: "INSUFFICIENT",
    claim: "Exercise always prevents depression.",
    evidence: "Regular physical activity can reduce the risk of depression and anxiety.",
    source_name: "CDC — Benefits of Physical Activity",
    source_url: "https://www.cdc.gov/physical-activity-basics/benefits/index.html",
    source_note: "Risk reduction does not justify an always-prevents claim."
  }
];

export function evaluateFalsification(model, predictFn) {
  return FALSIFICATION_SET.map(item => {
    const output = predictFn(model, item.claim, item.evidence);
    return {
      ...item,
      predicted: output.label,
      probabilities: output.probabilities,
      pass: output.label === item.expected,
      claim_ceiling: output.claim_ceiling
    };
  });
}
