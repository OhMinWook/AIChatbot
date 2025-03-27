// 화이트 리스트
export const ALLOWED_TABS = ['all', 'year', 'month', 'day'] as const;
export const ALLOWED_FILTERS = ['all', 'hospital', 'call_path'] as const;
export const ALLOWED_EMBEDDING_FILTERS = ['all', 'admin', 'type'] as const;

// 타입 자동 작성
export type Tabs = (typeof ALLOWED_TABS)[number];
export type Filter = (typeof ALLOWED_FILTERS)[number];
export type EmbeddingFilter = (typeof ALLOWED_EMBEDDING_FILTERS)[number];

// TEXT 변환
export const getTextFromTab = (tab: Tabs) => {
  let text;

  switch (tab) {
    case 'all':
      text = '전체';
      break;
    case 'year':
      text = '연도별';
      break;
    case 'month':
      text = '월별';
      break;
    case 'day':
      text = '일별';
      break;

    default:
      text = 'tab-filter.ts 함수 수정 필요';
      break;
  }

  return text;
};

export const getTextFromFilter = (filter: Filter) => {
  let text;

  switch (filter) {
    case 'all':
      text = '전체';
      break;
    case 'hospital':
      text = '병원별';
      break;
    case 'call_path':
      text = '호출경로(화면/api)';
      break;

    default:
      text = 'tab-filter.ts 함수 수정 필요';
      break;
  }

  return text;
};

export const getTextFromEmbeddingFilter = (filter: EmbeddingFilter) => {
  let text;

  switch (filter) {
    case 'all':
      text = '전체';
      break;
    case 'admin':
      text = '관리자별';
      break;
    case 'type':
      text = '전처리/임베딩별';
      break;

    default:
      text = 'tab-filter.ts 함수 수정 필요';
      break;
  }

  return text;
};
