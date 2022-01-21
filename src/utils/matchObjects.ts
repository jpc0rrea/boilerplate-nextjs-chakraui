interface MatchObjectsRequest {
  object1: Record<string, unknown>;
  object2: Record<string, unknown>;
}

export function matchObjects({
  object1,
  object2,
}: MatchObjectsRequest): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}
