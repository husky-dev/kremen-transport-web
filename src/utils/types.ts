export interface UnknowDict {
  [index: string]: unknown;
}

export const isUnknowDict = (candidate: unknown): candidate is UnknowDict =>
  typeof candidate === 'object' && candidate !== null;
