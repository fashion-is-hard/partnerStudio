// generate_proposals.js
// 실행: node generate_proposals.js
// 결과: ./data/proposals.json 생성

const fs = require("fs");
const path = require("path");

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// 카테고리별 타이틀 템플릿
const templates = {
  "스킨케어": [
    "민감피부 SOS 진정 세럼",
    "속광 수분크림",
    "장벽 강화 세라마이드 크림",
    "잡티 케어 비타C 앰플",
    "저자극 약산성 토너",
    "나이아신 톤업 에센스",
    "콜라겐 리프팅 앰플",
    "시카 진정 패드",
    "모공 타이트닝 세럼",
    "수분 폭탄 히알루론 크림"
  ],
  "메이크업": [
    "하루종일 무너짐 없는 틴트",
    "세미매트 쿠션 파운데이션",
    "초밀착 롱래스팅 파우더",
    "블러링 립무스",
    "아이브로우 픽서",
    "마스카라 컬링 픽스",
    "톤업 베이스 프라이머",
    "듀이 글로우 립오일",
    "멀티 유즈 블러셔",
    "프리즘 하이라이터"
  ],
  "헤어케어": [
    "손상모 복구 단백질 샴푸",
    "두피 진정 스케일링 토닉",
    "노워시 트리트먼트 미스트",
    "볼륨업 드라이 샴푸",
    "헤어오일 실키 피니시",
    "컬 크림 내추럴 웨이브",
    "탈모케어 카페인 샴푸",
    "비듬 케어 약산성 샴푸",
    "단백질 헤어팩 집중케어",
    "열보호 헤어에센스"
  ],
  "바디케어": [
    "저자극 시카 바디로션",
    "각질 케어 AHA 바디워시",
    "향 오래가는 퍼퓸 바디미스트",
    "튼살 케어 바디오일",
    "데오드란트 롤온 무향",
    "핸드크림 고보습 쉐어버터",
    "풋크림 갈라짐 집중케어",
    "바디스크럽 솔트 폴리싱",
    "바디크림 딥모이스처",
    "바디워시 약산성 클린"
  ],
  "건강기능": [
    "비타민C 1000 고함량",
    "유산균 데일리 케어",
    "콜라겐 젤리 스틱",
    "오메가3 rTG",
    "마그네슘 수면케어",
    "루테인 눈건강",
    "프로틴 쉐이크 저당",
    "홍삼 스틱 데일리",
    "멀티비타민 올인원",
    "철분+엽산"
  ],
  "생활용품": [
    "향균 핸드워시",
    "피부저자극 세제 캡슐",
    "섬유향수 코튼향",
    "구강세정 워터픽",
    "치약 미백 케어",
    "샤워타월 저자극",
    "메이크업 브러시 클리너",
    "화장솜 대용량",
    "향초 무드 라벤더",
    "디퓨저 우디향"
  ]
};

// 회사명 샘플
const companies = [
  "한실 산업","모노랩","루미코스","에코랩","더그린","셀라바이오","모던웍스","리프레시","블룸코스","온리원",
  "노바케어","뷰티픽","하이브랩","스킨앤코","리틀포레스트","코어앤코","메이커업","클린데이","바이탈랩","그로우업"
];

// 카테고리별 점수 특성(대충 그럴싸하게)
const categoryBias = {
  "스킨케어": { product: +6, brand: +0, risk: -2 },
  "메이크업": { product: +3, brand: +2, risk: -1 },
  "헤어케어": { product: +2, brand: +1, risk:  0 },
  "바디케어": { product: +1, brand: +1, risk:  0 },
  "건강기능": { product: +0, brand: -1, risk: +2 },
  "생활용품": { product: -1, brand: +0, risk: +1 }
};

function makeProposal(id) {
  const category = pick(Object.keys(templates));
  const titleBase = pick(templates[category]);
  const company = pick(companies);

  // 기본 점수 분포
  const bias = categoryBias[category] ?? { product: 0, brand: 0, risk: 0 };

  const product = clamp(randInt(70, 95) + bias.product, 55, 98);
  const brand = clamp(randInt(55, 85) + bias.brand, 40, 95);
  const risk = clamp(randInt(1, 18) + bias.risk, 1, 25);

  return {
    id,
    category,
    title: `${titleBase}${id % 7 === 0 ? ` (${randInt(2,5)}세대)` : ""}`.trim(),
    company,
    product,
    brand,
    risk
  };
}

const proposals = Array.from({ length: 50 }, (_, i) => makeProposal(i + 1));

const out = { proposals };

const outDir = path.join(__dirname, "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "proposals.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");

console.log(`✅ 생성 완료: ${outPath} (총 ${proposals.length}개)`);
