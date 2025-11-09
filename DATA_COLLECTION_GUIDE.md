# IdeaConnect 데이터 수집 가이드

## 🎯 목표

**50,000개 이상의 고품질 문구 수집**
- 10개 카테고리별 최소 5,000개
- 키워드 기반 검색에 최적화
- 시놀로지 NAS에 저장 및 배포
- Claude Code + 일반 Claude에서 활용

---

## 📊 카테고리 구조

| 카테고리 | 목표 수량 | 우선순위 | 특징 |
|---------|----------|---------|------|
| famous-quote | 10,000개 | ⭐⭐⭐ | 명언, 격언, 인용구 |
| book | 8,000개 | ⭐⭐⭐ | 책 구절, 문학 작품 |
| proverb | 5,000개 | ⭐⭐ | 속담, 사자성어, 금언 |
| movie | 7,000개 | ⭐⭐⭐ | 영화 대사 |
| academic | 6,000개 | ⭐⭐ | 학술 논문, 연구 |
| web | 5,000개 | ⭐⭐ | 블로그, 아티클 |
| essay | 4,000개 | ⭐ | 에세이, 칼럼 |
| poem | 3,000개 | ⭐ | 시, 시조 |
| drama | 2,000개 | ⭐ | 드라마 대사 |
| animation | 2,000개 | ⭐ | 애니메이션 대사 |

**총계: 52,000개**

---

## 📋 공통 품질 기준

### 1. 필수 요구사항

✅ **길이 제한**
- 최소: 10자 이상
- 최대: 500자 이하
- 권장: 50-200자 (가독성 최적)

✅ **언어**
- 한국어: 70% (35,000개)
- 영어: 30% (15,000개)
- 번역본은 원문과 함께 저장

✅ **출처 명시**
- 작가/저자 이름 필수
- 작품명 (책/영화/논문 등)
- 연도 (가능한 경우)
- URL (온라인 출처)

✅ **키워드**
- 최소 3개 이상
- 최대 10개 이하
- 검색 최적화를 위한 다양한 관점

### 2. 제외 기준

❌ **제외할 내용**
- 혐오, 차별, 폭력적 내용
- 정치적 편향이 강한 내용
- 저작권 문제 소지가 있는 최신 작품
- 광고성 문구
- 개인정보 포함
- 맥락 없이는 이해 불가능한 내용

### 3. 키워드 표준

**키워드 카테고리 (20개 주요 테마):**
1. 습관, 반복, 실천
2. 성장, 발전, 학습
3. 시간, 인내, 꾸준함
4. 목표, 꿈, 비전
5. 관계, 소통, 공감
6. 창의성, 혁신, 아이디어
7. 도전, 용기, 모험
8. 지혜, 통찰, 철학
9. 행복, 만족, 감사
10. 자유, 독립, 선택
11. 사랑, 우정, 가족
12. 실패, 극복, 회복
13. 리더십, 영향력, 책임
14. 집중, 몰입, 효율
15. 균형, 조화, 건강
16. 변화, 적응, 유연성
17. 진실, 정직, 신뢰
18. 겸손, 감사, 존중
19. 열정, 에너지, 활력
20. 평화, 고요, 명상

**키워드 작성 규칙:**
- 명사형 사용 (예: "성장하다" → "성장")
- 한국어 + 영어 동의어 모두 포함
- 구체적 + 추상적 키워드 조합
- 감정 + 행동 + 결과 키워드 균형

---

## 🎬 카테고리별 세부 기준

### 1. famous-quote (명언) - 10,000개

**정의:** 역사적 인물, 저명인사, 사상가의 명언

**수집 소스:**
- Wikiquote (영어/한국어)
- Goodreads Quotes
- BrainyQuote
- 명언 책자 (공개 도메인)
- 역사적 연설문

**품질 기준:**
```yaml
최소_저자_인지도: 중간 이상
검증_가능성: 출처 확인 가능
시대성: 제한 없음 (고대~현대)
보편성: 문화적으로 보편적 메시지
```

**JSON 구조:**
```json
{
  "id": "fq_001",
  "content": "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "content_ko": "우리는 반복적으로 하는 행동의 결과입니다. 따라서 탁월함은 행동이 아니라 습관입니다.",
  "author": "Aristotle",
  "author_ko": "아리스토텔레스",
  "source": "Nicomachean Ethics",
  "year": -350,
  "keywords": ["습관", "반복", "실천", "탁월함", "성장", "행동"],
  "category": "습관",
  "type": "famous-quote",
  "language": "en",
  "verified": true,
  "url": "https://en.wikiquote.org/wiki/Aristotle"
}
```

**수집 목표:**
- 영어: 6,000개
- 한국어: 4,000개

---

### 2. book (책 구절) - 8,000개

**정의:** 문학 작품, 자기계발서, 인문학 서적의 인상적인 구절

**수집 소스:**
- Project Gutenberg (공개 도메인)
- Google Books API
- 베스트셀러 명구집
- 고전 문학 작품

**품질 기준:**
```yaml
저작권: 공개 도메인 우선, 최근작은 짧은 인용만
완결성: 문맥 없이도 이해 가능
문학성: 표현의 아름다움, 통찰력
```

**JSON 구조:**
```json
{
  "id": "book_001",
  "content": "It is our choices, Harry, that show what we truly are, far more than our abilities.",
  "author": "J.K. Rowling",
  "source": "Harry Potter and the Chamber of Secrets",
  "year": 1998,
  "keywords": ["선택", "정체성", "능력", "가치관", "자유의지"],
  "category": "선택",
  "type": "book",
  "language": "en",
  "isbn": "978-0439064873",
  "genre": "fantasy"
}
```

**수집 목표:**
- 고전 문학: 3,000개
- 자기계발: 2,500개
- 인문/철학: 2,000개
- 소설: 500개

---

### 3. proverb (속담) - 5,000개

**정의:** 한국 속담, 사자성어, 세계 각국의 격언

**수집 소스:**
- 한국 속담 사전
- 사자성어 데이터베이스
- 세계 속담 컬렉션
- 민간 전승 격언

**품질 기준:**
```yaml
전통성: 오랜 기간 전승된 것
교훈성: 명확한 교훈이나 지혜
간결성: 대부분 20자 이내
```

**JSON 구조:**
```json
{
  "id": "prov_001",
  "content": "천 리 길도 한 걸음부터",
  "content_en": "A journey of a thousand miles begins with a single step",
  "author": "한국 속담",
  "origin": "한국",
  "keywords": ["시작", "실천", "인내", "꾸준함", "목표"],
  "category": "실천",
  "type": "proverb",
  "language": "ko",
  "meaning": "큰 일도 작은 시작이 중요함을 의미"
}
```

**수집 목표:**
- 한국 속담: 2,000개
- 사자성어: 1,500개
- 중국 격언: 800개
- 서양 속담: 700개

---

### 4. movie (영화 대사) - 7,000개

**정의:** 명작 영화의 인상적인 대사

**수집 소스:**
- IMDb Quotes
- 영화 대본 데이터베이스
- 명대사 컬렉션
- Wikiquote 영화 섹션

**품질 기준:**
```yaml
맥락_독립성: 영화를 안 봐도 이해 가능
인지도: 유명 영화 우선
시대성: 클래식 + 현대 균형
```

**JSON 구조:**
```json
{
  "id": "movie_001",
  "content": "Life is like a box of chocolates. You never know what you're gonna get.",
  "character": "Forrest Gump",
  "actor": "Tom Hanks",
  "movie": "Forrest Gump",
  "year": 1994,
  "director": "Robert Zemeckis",
  "keywords": ["인생", "불확실성", "운명", "모험", "수용"],
  "category": "인생",
  "type": "movie",
  "language": "en",
  "imdb_id": "tt0109830"
}
```

**수집 목표:**
- 미국 영화: 4,000개
- 한국 영화: 2,000개
- 기타 국가: 1,000개

---

### 5. academic (학술) - 6,000개

**정의:** 학술 논문, 연구서, 학자의 통찰

**수집 소스:**
- arXiv (공개 논문)
- Google Scholar
- 학술 서적 인용구
- TED Talks 스크립트

**품질 기준:**
```yaml
신뢰성: 학술지 게재 또는 인정받은 학자
명확성: 전문용어 최소화
실용성: 일반인도 이해 가능
```

**JSON 구조:**
```json
{
  "id": "acad_001",
  "content": "The key to learning is repetition and spacing over time, not mass practice.",
  "author": "Robert Bjork",
  "field": "Psychology",
  "source": "Memory and Metamemory Considerations",
  "year": 1994,
  "keywords": ["학습", "반복", "간격 반복", "기억", "효율"],
  "category": "학습",
  "type": "academic",
  "language": "en",
  "doi": "10.1037/0278-7393.20.5.1063"
}
```

**수집 목표:**
- 심리학: 1,500개
- 교육학: 1,200개
- 철학: 1,000개
- 경제/경영: 1,000개
- 과학: 800개
- 기타: 500개

---

### 6. web (웹 콘텐츠) - 5,000개

**정의:** 블로그, 아티클, 온라인 칼럼의 인사이트

**수집 소스:**
- Medium 인기 글
- 브런치 추천 글
- TED 스크립트
- 유명 블로그

**품질 기준:**
```yaml
조회수: 최소 1,000+ (인기도 검증)
저자_신뢰도: 검증된 작가
독창성: 기존 명언 재탕 X
```

**JSON 구조:**
```json
{
  "id": "web_001",
  "content": "당신이 매일 하는 작은 습관이 10년 후의 당신을 결정합니다.",
  "author": "제임스 클리어",
  "platform": "Medium",
  "url": "https://medium.com/@jamesclear/...",
  "publish_date": "2018-09-15",
  "keywords": ["습관", "시간", "미래", "변화", "꾸준함"],
  "category": "습관",
  "type": "web",
  "language": "ko",
  "views": 15000
}
```

**수집 목표:**
- 자기계발: 2,000개
- 생산성: 1,500개
- 인문학: 1,000개
- 기타: 500개

---

### 7. essay (에세이) - 4,000개

**정의:** 에세이, 칼럼, 수필의 인상적인 구절

**수집 소스:**
- 유명 에세이스트 작품
- 신문 칼럼
- 수필집

**JSON 구조:**
```json
{
  "id": "essay_001",
  "content": "느리게 사는 것과 게으른 것은 다르다.",
  "author": "김연수",
  "source": "청춘의 문장들",
  "year": 2014,
  "keywords": ["삶의 속도", "여유", "가치관", "행복"],
  "category": "삶",
  "type": "essay",
  "language": "ko"
}
```

---

### 8. poem (시) - 3,000개

**정의:** 시, 시조의 인상적인 구절

**수집 소스:**
- 공개 도메인 시집
- 유명 시인 작품

**JSON 구조:**
```json
{
  "id": "poem_001",
  "content": "Do not go gentle into that good night",
  "author": "Dylan Thomas",
  "source": "Do Not Go Gentle Into That Good Night",
  "year": 1951,
  "keywords": ["저항", "삶", "용기", "죽음"],
  "category": "용기",
  "type": "poem",
  "language": "en"
}
```

---

### 9. drama (드라마) - 2,000개

**정의:** TV 드라마의 명대사

**JSON 구조:**
```json
{
  "id": "drama_001",
  "content": "괜찮아요, 사랑이에요.",
  "character": "지해수",
  "drama": "괜찮아 사랑이야",
  "year": 2014,
  "keywords": ["사랑", "수용", "위로", "관계"],
  "category": "사랑",
  "type": "drama",
  "language": "ko"
}
```

---

### 10. animation (애니메이션) - 2,000개

**정의:** 애니메이션의 명대사

**JSON 구조:**
```json
{
  "id": "anim_001",
  "content": "The flower that blooms in adversity is the most rare and beautiful of all.",
  "character": "The Emperor",
  "animation": "Mulan",
  "year": 1998,
  "keywords": ["역경", "성장", "아름다움", "희귀성"],
  "category": "역경",
  "type": "animation",
  "language": "en"
}
```

---

## 🔧 수집 방법론

### 단계별 접근법

**Phase 1: 기반 구축 (1-2주)**
- [ ] 공개 API 활용 (Quotable, Wikiquote, Google Books)
- [ ] 자동 수집 스크립트 작성
- [ ] 목표: 10,000개

**Phase 2: 큐레이션 (2-4주)**
- [ ] 인기 웹사이트 크롤링
- [ ] 반자동 수집 + 품질 검증
- [ ] 목표: 20,000개

**Phase 3: 전문화 (4-8주)**
- [ ] 카테고리별 전문 소스
- [ ] 수동 큐레이션
- [ ] 목표: 50,000개

---

## 🤖 자동 수집 도구

### 1. API 기반 수집

**quotable.io API:**
```javascript
// scripts/collect-quotes.js
const axios = require('axios');

async function collectQuotes(tag, count = 1000) {
  const quotes = [];

  for (let page = 1; page <= count / 20; page++) {
    const response = await axios.get(
      `https://api.quotable.io/quotes?tags=${tag}&page=${page}`
    );

    for (const quote of response.data.results) {
      quotes.push({
        id: `fq_${quote._id}`,
        content: quote.content,
        author: quote.author,
        keywords: extractKeywords(quote.content, quote.tags),
        category: mapCategory(quote.tags[0]),
        type: 'famous-quote',
        language: 'en',
        verified: true
      });
    }

    await sleep(1000); // Rate limiting
  }

  return quotes;
}
```

**Google Books API:**
```javascript
async function collectBookQuotes(keyword) {
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q="${keyword}"+quote&maxResults=40`
  );

  // Extract notable quotes from descriptions
  // ...
}
```

### 2. 웹 스크래핑

**주의사항:**
- robots.txt 확인
- Rate limiting 준수
- 저작권 확인
- User-Agent 설정

```javascript
const puppeteer = require('puppeteer');

async function scrapeQuotes(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  const quotes = await page.evaluate(() => {
    const elements = document.querySelectorAll('.quote');
    return Array.from(elements).map(el => ({
      content: el.querySelector('.text').innerText,
      author: el.querySelector('.author').innerText
    }));
  });

  await browser.close();
  return quotes;
}
```

### 3. 데이터 검증 스크립트

```javascript
// scripts/validate-quotes.js
function validateQuote(quote) {
  const errors = [];

  // 필수 필드 체크
  if (!quote.id) errors.push('ID 없음');
  if (!quote.content) errors.push('내용 없음');
  if (!quote.author) errors.push('저자 없음');

  // 길이 체크
  if (quote.content.length < 10) errors.push('내용이 너무 짧음');
  if (quote.content.length > 500) errors.push('내용이 너무 김');

  // 키워드 체크
  if (!quote.keywords || quote.keywords.length < 3) {
    errors.push('키워드 부족 (최소 3개)');
  }

  // 중복 체크
  if (isDuplicate(quote.content)) {
    errors.push('중복된 내용');
  }

  return errors;
}

function validateDataset(quotes) {
  const report = {
    total: quotes.length,
    valid: 0,
    invalid: 0,
    errors: []
  };

  for (const quote of quotes) {
    const errors = validateQuote(quote);

    if (errors.length === 0) {
      report.valid++;
    } else {
      report.invalid++;
      report.errors.push({ id: quote.id, errors });
    }
  }

  return report;
}
```

---

## 📁 저장소 구조

```
/Volumes/work-sync/project/ideamemo/
├── famous-quote/
│   ├── en/
│   │   ├── batch_001.json (1,000개)
│   │   ├── batch_002.json (1,000개)
│   │   └── ...
│   └── ko/
│       ├── batch_001.json (1,000개)
│       └── ...
├── book/
│   ├── classic/
│   ├── self-help/
│   └── philosophy/
├── proverb/
│   ├── korean.json
│   ├── chinese.json
│   └── western.json
├── movie/
├── academic/
├── web/
├── essay/
├── poem/
├── drama/
└── animation/

# 메타데이터
├── index.json              # 전체 인덱스
├── categories.json         # 카테고리 통계
└── keywords.json           # 키워드 색인
```

**index.json 구조:**
```json
{
  "version": "1.0.0",
  "updated": "2025-11-09",
  "stats": {
    "famous-quote": 10000,
    "book": 8000,
    "proverb": 5000,
    "movie": 7000,
    "academic": 6000,
    "web": 5000,
    "essay": 4000,
    "poem": 3000,
    "drama": 2000,
    "animation": 2000,
    "total": 52000
  },
  "files": [
    {
      "path": "famous-quote/en/batch_001.json",
      "count": 1000,
      "language": "en"
    }
  ]
}
```

---

## 🔍 품질 관리

### 1. 자동 검증

```javascript
// 중복 제거
function deduplicateQuotes(quotes) {
  const seen = new Set();
  const unique = [];

  for (const quote of quotes) {
    // 내용의 처음 50자로 유사도 체크
    const fingerprint = quote.content
      .substring(0, 50)
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '');

    if (!seen.has(fingerprint)) {
      seen.add(fingerprint);
      unique.push(quote);
    }
  }

  return unique;
}

// 유사도 체크 (Levenshtein distance)
function calculateSimilarity(str1, str2) {
  // ... 편집 거리 계산
  return similarity;
}
```

### 2. 수동 검토

**검토 체크리스트:**
- [ ] 내용의 정확성
- [ ] 출처 확인
- [ ] 키워드 적절성
- [ ] 카테고리 분류
- [ ] 번역 품질 (번역본인 경우)

### 3. 커뮤니티 피드백

- 사용자 신고 시스템
- 평점/투표 시스템
- 수정 제안 기능

---

## 🚀 IdeaConnect 통합

### NASQuotesAPI.ts 구현

```typescript
// src/features/search/api/NASQuotesAPI.ts
const NAS_URL = 'https://ideaconnect.your-nas.synology.me';

interface NASQuote {
  id: string;
  content: string;
  author: string;
  keywords: string[];
  category: string;
  type: IdeaType;
  language: 'ko' | 'en';
}

let cache: Map<IdeaType, NASQuote[]> = new Map();

/**
 * 특정 타입의 명언 로드
 */
async function loadQuotesByType(type: IdeaType): Promise<NASQuote[]> {
  if (cache.has(type)) {
    return cache.get(type)!;
  }

  try {
    // 타입별로 모든 배치 파일 로드
    const indexResponse = await fetch(`${NAS_URL}/ideamemo/index.json`);
    const index = await indexResponse.json();

    const typeFiles = index.files.filter((f: any) =>
      f.path.startsWith(`${type}/`)
    );

    const quotes: NASQuote[] = [];

    for (const file of typeFiles) {
      const response = await fetch(`${NAS_URL}/ideamemo/${file.path}`);
      const batch = await response.json();
      quotes.push(...batch);
    }

    cache.set(type, quotes);
    console.log(`✅ NAS에서 ${type} ${quotes.length}개 로드`);

    return quotes;
  } catch (error) {
    console.error(`❌ NAS ${type} 로드 실패:`, error);
    return [];
  }
}

/**
 * NAS 전체 검색
 */
export async function searchNASQuotes(
  keywords: string[],
  types: IdeaType[] = []
): Promise<Partial<Idea>[]> {
  try {
    // 검색할 타입 결정
    const searchTypes = types.length > 0
      ? types
      : ['famous-quote', 'book', 'movie', 'proverb', 'academic', 'web'];

    // 병렬로 각 타입 로드
    const typeQuotes = await Promise.all(
      searchTypes.map(type => loadQuotesByType(type))
    );

    const allQuotes = typeQuotes.flat();

    // 키워드 매칭
    const matches = allQuotes.filter(quote =>
      keywords.some(keyword => quote.keywords.includes(keyword))
    );

    // 점수 계산
    const scored = matches.map(quote => {
      const matchCount = keywords.filter(k =>
        quote.keywords.includes(k)
      ).length;

      const similarity = 0.65 + (matchCount * 0.08);

      return {
        quote,
        similarity: Math.min(similarity, 0.95)
      };
    });

    // 상위 10개
    const topMatches = scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    return topMatches.map(({ quote, similarity }) => ({
      type: quote.type,
      content: quote.content,
      source: {
        author: quote.author,
        category: quote.category,
        platform: 'NAS 데이터베이스'
      } as IdeaSource,
      similarity,
      reasoning: `"${keywords.join(', ')}"와 관련된 ${quote.type}입니다.`
    }));

  } catch (error) {
    console.error('NAS 검색 실패:', error);
    return [];
  }
}

/**
 * 캐시 리프레시
 */
export function refreshNASCache() {
  cache.clear();
}
```

### SearchService.ts 통합

```typescript
// src/features/search/SearchService.ts
import { searchNASQuotes } from './api/NASQuotesAPI';

// ... (기존 코드)

// NAS 검색 추가
if (selectedTypes.length === 0 || selectedTypes.length > 1) {
  // 여러 타입 검색 시 NAS 사용
  searchPromises.push(
    searchNASQuotes(keywords, selectedTypes).catch(err => {
      console.error('NAS 검색 오류:', err);
      return [];
    })
  );
} else {
  // 단일 타입은 로컬 + API 사용
  if (shouldSearch['famous-quote']) {
    searchPromises.push(searchLocalQuotes(keywords));
    searchPromises.push(searchQuotes(keywords));
  }
}
```

---

## 📊 진행 추적

### 수집 현황 대시보드

```javascript
// scripts/stats.js
const fs = require('fs');

function generateStats() {
  const index = JSON.parse(
    fs.readFileSync('/Volumes/work-sync/project/ideamemo/index.json')
  );

  console.log('📊 IdeaConnect 데이터 수집 현황\n');
  console.log('카테고리           | 현재   | 목표   | 진행률');
  console.log('------------------|--------|--------|-------');

  const targets = {
    'famous-quote': 10000,
    'book': 8000,
    'proverb': 5000,
    'movie': 7000,
    'academic': 6000,
    'web': 5000,
    'essay': 4000,
    'poem': 3000,
    'drama': 2000,
    'animation': 2000
  };

  for (const [type, target] of Object.entries(targets)) {
    const current = index.stats[type] || 0;
    const progress = ((current / target) * 100).toFixed(1);

    console.log(
      `${type.padEnd(18)}| ${current.toString().padStart(6)} | ${target.toString().padStart(6)} | ${progress}%`
    );
  }

  const totalCurrent = Object.values(index.stats).reduce((a, b) => a + b, 0);
  const totalTarget = 52000;

  console.log('\n' + '='.repeat(50));
  console.log(`전체 진행률: ${totalCurrent} / ${totalTarget} (${((totalCurrent / totalTarget) * 100).toFixed(1)}%)`);
}
```

---

## 🎯 우선순위 실행 계획

### Week 1-2: 핵심 데이터 수집

```bash
# 1. Quotable API로 명언 10,000개 수집
node scripts/collect-quotable.js

# 2. 한국 속담 DB 구축
node scripts/collect-korean-proverbs.js

# 3. 영화 명대사 (IMDb)
node scripts/collect-movie-quotes.js
```

### Week 3-4: 확장

```bash
# 4. Google Books API
node scripts/collect-book-quotes.js

# 5. 학술 인용구
node scripts/collect-academic-quotes.js

# 6. 웹 콘텐츠 (Medium, 브런치)
node scripts/collect-web-content.js
```

### Week 5-8: 큐레이션

- 수동 검토 및 품질 향상
- 번역 추가
- 키워드 최적화

---

## 🔐 법적 고려사항

### 저작권 준수

**안전한 소스:**
- ✅ 공개 도메인 (70년 이상 경과)
- ✅ Creative Commons 라이선스
- ✅ API 공식 제공 데이터
- ✅ Fair Use 범위의 짧은 인용

**주의 필요:**
- ⚠️ 최근 출판물 (짧은 인용만)
- ⚠️ 번역본 (번역자 저작권)
- ⚠️ 웹 스크래핑 (robots.txt 확인)

### 라이선스 명시

```json
{
  "license": {
    "type": "CC-BY-SA-4.0",
    "url": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attribution": "Data collected from public APIs and public domain sources"
  }
}
```

---

## 📚 참고 자료

### 무료 데이터 소스

**명언:**
- https://api.quotable.io
- https://en.wikiquote.org
- https://www.brainyquote.com

**책:**
- https://www.gutenberg.org
- https://developers.google.com/books

**학술:**
- https://arxiv.org
- https://scholar.google.com

**영화:**
- https://www.imdb.com/interfaces/ (데이터셋)
- https://www.imsdb.com (스크립트)

### 도구

**크롤링:**
- Puppeteer
- Cheerio
- Axios

**데이터 처리:**
- Lodash
- Papa Parse (CSV)
- json2csv

**검증:**
- Joi (스키마 검증)
- Jest (테스트)

---

## ✅ 체크리스트

### 시작 전
- [ ] NAS 폴더 구조 생성 (/ideamemo/)
- [ ] 수집 스크립트 환경 설정
- [ ] API 키 발급 (Google Books 등)
- [ ] 법적 검토 완료

### 수집 중
- [ ] 일일 백업
- [ ] 품질 검증 자동화
- [ ] 진행 상황 추적
- [ ] 중복 제거

### 완료 후
- [ ] 최종 검증
- [ ] 인덱스 파일 생성
- [ ] NAS 업로드
- [ ] IdeaConnect 통합 테스트
- [ ] 문서화

---

## 🎉 기대 효과

**수집 완료 시:**
- ✅ 52,000개 고품질 문구 데이터베이스
- ✅ 10개 카테고리 균형잡힌 분포
- ✅ 키워드 기반 정확한 검색
- ✅ NAS를 통한 확장 가능한 인프라
- ✅ Claude + Claude Code 완벽 연동

**IdeaConnect 사용자 경험:**
- 모든 메모에서 평균 5-10개 관련 아이디어 발견
- 다양한 출처의 통찰 제공
- 한국어/영어 균형잡힌 결과
- 빠른 검색 속도 (캐싱)

---

**작성일:** 2025-11-09
**작성자:** Claude Code
**버전:** 1.0.0

---

## 다음 단계

1. **이 가이드 검토 및 피드백**
2. **우선순위 조정**
3. **수집 스크립트 구현**
4. **파일럿 테스트 (1,000개)**
5. **본격 수집 시작**

**질문이나 제안사항이 있으면 언제든 말씀해주세요! 🚀**
