export const getVariantFromPathname = (pathname: string | null): string[] => {
  if (pathname === null) return [];

  const parts = pathname.split('/admin');

  if (parts[1] && parts[1].trim()) {
    return parts[1].split('/').filter((part) => part.trim().length > 0);
  }

  return [];
};
