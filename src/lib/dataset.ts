export function datasetPath(paper: string, module: string): string {
  const version = process.env.DATASET_VERSION ?? "v2025-09";
  const moduleFile = module.replace(/^m/, "");
  return `/datasets/${version}/paper-${paper}-module-${moduleFile}.json`;
}

