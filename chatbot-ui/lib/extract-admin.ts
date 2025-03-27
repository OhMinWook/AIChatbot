export const convertItemsToNumbersString = (itemsArray: string[]): string => {
  const mapping: Record<any, number> = {
    manual: 2,
    qna: 3,
    dashboard: 4,
  };

  const numbers: number[] = [];

  for (const item of itemsArray) {
    if (!(item in mapping)) {
      return '';
    }
    numbers.push(mapping[item as any]);
  }

  return numbers.join(',');
};

// 아이템 배열 정의
const items = [
  {
    id: 'manual',
    label: '메뉴얼 관리',
  },
  {
    id: 'qna',
    label: '답변 관리',
  },
  {
    id: 'dashboard',
    label: '사용량 대시보드',
  },
];

// 숫자와 아이템 ID의 매핑 정의
const numberToIdMapping: Record<number, string> = {
  2: 'manual',
  3: 'qna',
  4: 'dashboard',
};

export const convertNumbersStringToItems = (
  numbersString: string,
): typeof items => {
  if (!numbersString) return []; // 입력이 비어있으면 빈 배열 반환

  // 문자열을 콤마로 분리하고, 각 부분을 숫자로 변환
  const numberArray = numbersString
    .split(',')
    .map((numStr) => parseInt(numStr.trim(), 10))
    .filter((num) => !isNaN(num)); // 유효한 숫자만 필터링

  // 중복 제거
  const uniqueNumbers = Array.from(new Set(numberArray));

  // 숫자를 아이템 객체로 매핑
  const result = uniqueNumbers.reduce<typeof items>((acc, num) => {
    const id = numberToIdMapping[num];
    if (id) {
      // 유효한 ID가 있는 경우
      const item = items.find((item) => item.id === id);
      if (item) {
        acc.push(item);
      }
    }
    return acc;
  }, []);

  return result;
};
