// manual-register1 정규 표현식 regex

// regex.config.tsx

// 정규표현식으로 숫자 및 범위 형식만 허용
export const pageRegex = /^\d+(\s*~\s*\d+)?(\s*,\s*\d+(\s*~\s*\d+)?)*$/;

// 입력값에서 페이지 숫자 추출 및 중복 검증
export const extractPages = (input: string) => {
  const pages = new Set<number>();
  const ranges = input.split(',').map((s) => s.trim()); // 쉼표로 구분된 페이지 범위

  for (let range of ranges) {
    if (range.includes('~')) {
      const [start, end] = range.split('~').map(Number); // 시작과 끝 범위 구분
      if (start > end) throw new Error(`잘못된 범위: ${range}`); // 범위가 올바른지 확인

      for (let i = start; i <= end; i++) {
        // 범위 내의 숫자를 Set에 추가
        if (pages.has(i)) {
          throw new Error(`중복된 페이지: ${i}`); // 중복되면 에러 발생
        }
        pages.add(i);
      }
    } else {
      const page = Number(range); // 개별 페이지
      if (pages.has(page)) {
        throw new Error(`중복된 페이지: ${page}`); // 중복되면 에러 발생
      }
      pages.add(page);
    }
  }
  return pages;
};
