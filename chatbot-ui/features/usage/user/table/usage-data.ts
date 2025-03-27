export interface UsageData {
  filter: string;
  token: number;
  usageMoney: number;
  date: string;
}

const numEntries = 1000;

export const usageData: UsageData[] = Array.from(
  { length: numEntries },
  (_, index) => ({
    filter: '전체',
    token: index + 1,
    usageMoney: 4,
    date: '2020.01 ~ 2024.02',
  }),
);
