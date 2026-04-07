// 지출 카테고리
export const EXPENSE_CATEGORIES = [
  { id: "c001", name: "식비", type: "expense" },
  { id: "c002", name: "교통", type: "expense" },
  { id: "c003", name: "쇼핑", type: "expense" },
  { id: "c004", name: "의료", type: "expense" },
  { id: "c005", name: "교육", type: "expense" },
  { id: "c006", name: "여가", type: "expense" },
  { id: "c007", name: "주거", type: "expense" },
  { id: "c008", name: "기타", type: "expense" }
];

// 수입 카테고리
export const INCOME_CATEGORIES = [
  { id: "c009", name: "급여", type: "income" },
  { id: "c010", name: "용돈", type: "income" },
  { id: "c011", name: "부수입", type: "income" },
  { id: "c012", name: "이자소득", type: "income" },
  { id: "c013", name: "상여금", type: "income" },
  { id: "c014", name: "주식/배당", type: "income" },
  { id: "c015", name: "포인트", type: "income" },
  { id: "c016", name: "기타", type: "income" }
];

// 전체 카테고리
export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES
];