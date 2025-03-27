import { ALL_DATE } from '@/const/date-const';
import { EmbeddingFilter, Tabs } from '@/const/tab-filter';
import { addHours, format, parse } from 'date-fns';

export const convertToUnixTime = (
  dateString: string,
  option: 'start' | 'end',
): number => {
  // 입력된 'yyyyMMdd' 형식의 날짜를 파싱 (UTC 기준)
  const parsedDate = parse(dateString, 'yyyyMMdd', new Date());

  // 옵션에 따라 시간을 설정
  if (option === 'start') {
    parsedDate.setHours(0, 0, 0, 0); // 해당 날의 00:00
  } else if (option === 'end') {
    parsedDate.setHours(23, 59, 0, 0); // 해당 날의 23:59
  }

  // 초 단위로 Unix timestamp 반환
  return Math.floor(parsedDate.getTime() / 1000);
};

interface SearchOption {
  [key: string]: any;
}

interface ConvertDateOptionParams {
  lastId: number;
  pageSize: number;
  startDate?: string | number;
  endDate?: string | number;
  searchOption?: SearchOption;
  lastUpdateDt?: string | number | null;
  dateFilter?: string;
  detailFilter?: string;
}

interface ConvertedParams {
  last_id: number;
  page_size: number;
  [key: string]: any;
}

export const convertDateOption = ({
  lastId,
  pageSize,
  startDate,
  endDate,
  searchOption,
  lastUpdateDt,
  dateFilter,
  detailFilter,
}: ConvertDateOptionParams): ConvertedParams => {
  const formatAllDate = format(ALL_DATE, 'yyyyMMdd');

  const baseParams: ConvertedParams = {
    last_id: lastId,
    page_size: pageSize,
  };

  if (searchOption) {
    Object.assign(baseParams, searchOption);
  }

  if (endDate) {
    baseParams.end_dt = convertToUnixTime(String(endDate), 'end');
  }

  if (startDate && String(startDate) !== formatAllDate) {
    baseParams.start_dt = convertToUnixTime(String(startDate), 'start');
  }

  if (lastUpdateDt) {
    baseParams.last_update_dt = lastUpdateDt;
  }

  if (dateFilter) {
    baseParams.date_filter = dateFilter;
  }

  if (detailFilter) {
    baseParams.detail_filter = detailFilter;
  }

  return baseParams;
};

export const formatDateRange = (dateRange: string): string => {
  const [start, end] = dateRange.split(' - ');
  if (start === '2000.01') {
    return `전체 - ${end}`;
  }
  return dateRange;
};
