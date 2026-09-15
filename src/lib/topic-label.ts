const SPECIAL_LABELS: Record<string, string> = {
  dips: "DIPS",
  ivrd: "IVRD",
  p2p: "P2P",
  pdpa: "PDPA",
  pdvl: "PDVL",
  sgsecure: "SGSecure",
  vl: "VL",
  vlps: "VLPS",
};

function formatWord(word: string) {
  const normalized = word.toLowerCase();
  return SPECIAL_LABELS[normalized] ?? `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
}

export function formatTopicLabel(tag: string) {
  return tag.split("_").filter(Boolean).map(formatWord).join(" ");
}
