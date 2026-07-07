export const normalizePhone = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const digits = value.replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
};
