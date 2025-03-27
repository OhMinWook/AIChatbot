export const truncateString = (str: string, maxLength: number): string => {
  const cleanStr = str.replace(/^https?:\/\//, '');

  if (cleanStr.length <= maxLength) return cleanStr;
  return cleanStr.slice(0, maxLength) + '...';
};
