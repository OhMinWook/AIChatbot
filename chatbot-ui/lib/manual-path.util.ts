export const isValidManualPath = (
  manualPath: (string | null)[] | undefined,
): boolean => {
  if (!manualPath) return false;
  return !(manualPath.length === 1 && manualPath[0] === null);
};
