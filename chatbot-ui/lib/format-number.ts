export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatPhoneNumber = (
  phoneNumber: string | null | undefined,
): string => {
  if (typeof phoneNumber !== 'string') return '';

  if (phoneNumber.length === 11) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  }

  return phoneNumber;
};

export const formatManualPath = (text: string, num: number) => {
  const front = text.slice(0, num);
  const behind = text.slice(-num);
  return `${front}...${behind}`;
};
