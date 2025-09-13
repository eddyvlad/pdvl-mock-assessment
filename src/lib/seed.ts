export const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function isValidSeed(seed: string): boolean {
  return /^[0-9a-zA-Z]{6}$/.test(seed);
}

export function generateSeed(length = 6): string {
  let out = "";
  const chars = BASE62.length;
  for (let i = 0; i < length; i += 1) {
    out += BASE62[Math.floor(Math.random() * chars)];
  }
  return out;
}

export function decodeBase62(seed: string): number {
  return seed.split("").reduce((acc, char) => acc * 62 + BASE62.indexOf(char), 0);
}

export function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function moduleRng(seed: string, moduleKey: string): () => number {
  let base = decodeBase62(seed);
  for (const ch of moduleKey) {
    base ^= ch.charCodeAt(0);
  }
  return mulberry32(base >>> 0);
}

