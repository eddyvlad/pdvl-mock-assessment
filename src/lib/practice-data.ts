import { headers } from "next/headers";
import { datasetPath } from "./dataset";
import { getModuleRng, type Question, sampleQuestions } from "./questions";

type DatasetProtocol = "http" | "https";
type HeaderReader = Pick<Headers, "get">;

function normalizeProtocol(value: string | null | undefined): DatasetProtocol | null {
  const protocol = value?.split(",", 1)[0]?.trim().toLowerCase();
  return protocol === "http" || protocol === "https" ? protocol : null;
}

export function getDatasetProtocol(
  requestHeaders: HeaderReader,
  configuredHost = process.env.HOST,
  environment: string = process.env.NODE_ENV,
): DatasetProtocol {
  if (environment === "development") {
    return "http";
  }

  const forwardedProtocol = normalizeProtocol(requestHeaders.get("x-forwarded-proto"));
  if (forwardedProtocol) {
    return forwardedProtocol;
  }

  if (configuredHost) {
    try {
      const configuredProtocol = normalizeProtocol(new URL(configuredHost).protocol.slice(0, -1));
      if (configuredProtocol) {
        return configuredProtocol;
      }
    } catch {
      // Fall back to the environment default when HOST is not a valid URL.
    }
  }

  return "https";
}

export async function loadPracticeQuestions(paper: string, module: string, seed: string, count: number) {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host") ?? "localhost:3000";
    const protocol = getDatasetProtocol(requestHeaders);
    const response = await fetch(`${protocol}://${host}${datasetPath(paper, module)}`);
    if (!response.ok) {
      return null;
    }

    const pool = (await response.json()) as Question[];
    return sampleQuestions(pool, count, getModuleRng(seed, module));
  } catch {
    return null;
  }
}
