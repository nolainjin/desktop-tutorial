# IdeaConnect v2 - 상세 설계 문서

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [아키텍처 설계](#아키텍처-설계)
4. [데이터 모델](#데이터-모델)
5. [주요 기능 명세](#주요-기능-명세)
6. [UI/UX 설계](#uiux-설계)
7. [구현 단계](#구현-단계)
8. [성능 최적화](#성능-최적화)
9. [향후 확장성](#향후-확장성)

---

## 프로젝트 개요

### 핵심 컨셉
**"생각을 연결하고, 지혜를 발견하는 지식 네트워크"**

옵시디언 스타일의 그래프 기반 메모 앱으로, 사용자의 생각(메모)과 세상의 지혜(아이디어)를 자동으로 연결하여 새로운 인사이트를 발견합니다.

### 핵심 가치
- **최소 리소스**: 텍스트 중심, 미니멀 UI
- **자동 연결**: 무료 API 활용한 실시간 아이디어 검색
- **시각적 발견**: 옵시디언 스타일 그래프로 연결성 시각화
- **품질 관리**: 연결성 낮은 아이디어 자동 제거
- **안전성**: 버전 스냅샷 기능 (최대 10개)

### 주요 용어 정의
- **메모 (Memo)**: 사용자가 작성한 생각/노트
- **아이디어 (Idea)**: 외부에서 가져온 지혜 (명언, 문구, 대사 등)
- **연결 (Connection)**: 메모와 아이디어 간의 관계
- **노드 (Node)**: 그래프 상의 메모 또는 아이디어
- **범주 (Category)**: AI가 추천하는 메모 그룹

---

## 기술 스택

### Frontend
```json
{
  "framework": "React 18",
  "language": "TypeScript 5.0+",
  "bundler": "Vite 5.0",
  "styling": "TailwindCSS 3.4",
  "state": "Zustand 4.5"
}
```

### 핵심 라이브러리
| 라이브러리 | 용도 | 리소스 |
|-----------|------|--------|
| `react-force-graph` | 그래프 시각화 | ~100KB |
| `dexie` | IndexedDB ORM | ~50KB |
| `react-markdown` | 마크다운 렌더링 | ~60KB |
| `@tanstack/react-query` | 데이터 패칭 | ~40KB |
| `date-fns` | 날짜 처리 | ~20KB |

**총 번들 크기 목표: < 500KB (gzipped < 150KB)**

### 데이터 저장
- **IndexedDB**: 메모, 아이디어, 연결, 버전 스냅샷
- **LocalStorage**: 사용자 설정, UI 상태

### 외부 API (무료)
1. **Quotable API**: 영문 명언
2. **Wikipedia API**: 백과사전 지식
3. **Google Books API**: 책 정보
4. **한국 속담 DB**: 자체 구축 (JSON)

---

## 아키텍처 설계

### 폴더 구조
```
src/
├── components/           # UI 컴포넌트
│   ├── memo/            # 메모 관련
│   │   ├── MemoList.tsx
│   │   ├── MemoEditor.tsx
│   │   ├── MemoCard.tsx
│   │   └── MemoSearch.tsx
│   ├── idea/            # 아이디어 관련
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaFilter.tsx
│   │   └── IdeaTypeIcon.tsx
│   ├── graph/           # 그래프 뷰
│   │   ├── GraphView.tsx
│   │   ├── GraphControls.tsx
│   │   ├── NodeTooltip.tsx
│   │   └── ForceGraphConfig.ts
│   ├── category/        # 범주화
│   │   ├── CategoryPanel.tsx
│   │   └── CategorySuggestion.tsx
│   ├── version/         # 버전 관리
│   │   ├── VersionHistory.tsx
│   │   └── VersionRestore.tsx
│   └── common/          # 공통 컴포넌트
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Loading.tsx
│       └── EmptyState.tsx
├── features/            # 기능별 모듈
│   ├── search/          # 검색 엔진
│   │   ├── SearchService.ts
│   │   ├── KeywordExtractor.ts
│   │   ├── SimilarityCalculator.ts
│   │   └── api/
│   │       ├── QuotableAPI.ts
│   │       ├── WikipediaAPI.ts
│   │       ├── GoogleBooksAPI.ts
│   │       └── ProverbsDB.ts
│   ├── graph/           # 그래프 로직
│   │   ├── GraphBuilder.ts
│   │   ├── LayoutCalculator.ts
│   │   └── ConnectionAnalyzer.ts
│   ├── categorize/      # 범주화 로직
│   │   ├── ClusteringService.ts
│   │   └── CategoryRecommender.ts
│   └── version/         # 버전 관리
│       ├── SnapshotService.ts
│       └── DiffCalculator.ts
├── stores/              # Zustand 상태 관리
│   ├── memoStore.ts
│   ├── ideaStore.ts
│   ├── graphStore.ts
│   ├── uiStore.ts
│   └── versionStore.ts
├── db/                  # 데이터베이스
│   ├── schema.ts        # IndexedDB 스키마
│   ├── migrations.ts    # DB 마이그레이션
│   └── queries/
│       ├── memoQueries.ts
│       ├── ideaQueries.ts
│       └── connectionQueries.ts
├── types/               # TypeScript 타입
│   ├── memo.ts
│   ├── idea.ts
│   ├── connection.ts
│   ├── graph.ts
│   └── version.ts
├── utils/               # 유틸리티
│   ├── markdown.ts
│   ├── validation.ts
│   ├── formatting.ts
│   └── constants.ts
├── hooks/               # 커스텀 훅
│   ├── useMemo.ts
│   ├── useIdea.ts
│   ├── useGraph.ts
│   └── useSearch.ts
├── App.tsx              # 메인 앱
├── Router.tsx           # 라우팅
└── main.tsx             # 엔트리 포인트
```

### 컴포넌트 계층 구조
```
App
├── Header
│   ├── Logo
│   ├── SearchBar
│   └── VersionIndicator
├── Sidebar
│   ├── MemoList
│   │   ├── MemoCard (multiple)
│   │   └── NewMemoButton
│   └── CategoryPanel
│       └── CategorySuggestion
├── MainView (Router)
│   ├── MemoDetailView
│   │   ├── MemoEditor
│   │   ├── IdeaList
│   │   │   ├── IdeaFilter
│   │   │   └── IdeaCard (multiple)
│   │   └── ConnectionIndicator
│   └── GraphView
│       ├── GraphControls
│       ├── ForceGraph3D
│       └── NodeTooltip
└── Modal (conditional)
    ├── VersionHistory
    └── Settings
```

---

## 데이터 모델

### 1. Memo (메모)
```typescript
interface Memo {
  id: string;                    // UUID
  title: string;                 // 제목 (최대 200자)
  content: string;               // 마크다운 내용
  tags: string[];                // 태그 배열
  createdAt: Date;               // 생성일시
  updatedAt: Date;               // 수정일시
  connectionCount: number;       // 연결된 아이디어 수
  categoryId?: string;           // 소속 범주 (optional)
}
```

### 2. Idea (아이디어)
```typescript
type IdeaType =
  | 'movie'          // 영화 대사
  | 'drama'          // 드라마 대사
  | 'animation'      // 애니메이션 대사
  | 'book'           // 책
  | 'essay'          // 에세이
  | 'poem'           // 시
  | 'famous-quote'   // 위인 명언
  | 'proverb'        // 속담
  | 'academic'       // 학문적 내용
  | 'web'            // 웹 자료
  | 'memo';          // 내 메모 (다른 메모와의 연결)

interface IdeaSource {
  author?: string;               // 저자/인물
  title?: string;                // 작품명/제목
  year?: string;                 // 연도
  url?: string;                  // 출처 URL
  category?: string;             // 세부 분류
  platform?: string;             // 플랫폼 (Wikipedia, Google Books 등)
}

interface Idea {
  id: string;                    // UUID
  memoId: string;                // 연결된 메모 ID
  type: IdeaType;                // 아이디어 타입
  content: string;               // 문장 내용
  source: IdeaSource;            // 출처 정보
  similarity: number;            // 유사도 점수 (0-1)
  reasoning: string;             // 연결 이유 설명
  createdAt: Date;               // 추가일시
  userFeedback?: 'up' | 'down';  // 사용자 피드백
}
```

### 3. Connection (연결)
```typescript
interface Connection {
  id: string;                    // UUID
  memoId: string;                // 메모 ID
  ideaId: string;                // 아이디어 ID
  strength: number;              // 연결 강도 (0-1)
  createdAt: Date;               // 연결 생성일시
  isAutomatic: boolean;          // 자동 생성 여부
}
```

### 4. Category (범주)
```typescript
interface Category {
  id: string;                    // UUID
  name: string;                  // 범주명
  description: string;           // 설명
  memoIds: string[];             // 포함된 메모 ID 배열
  commonThemes: string[];        // 공통 주제 키워드
  createdAt: Date;               // 생성일시
  isAiSuggested: boolean;        // AI 추천 여부
}
```

### 5. Version (버전 스냅샷)
```typescript
interface VersionSnapshot {
  id: string;                    // UUID
  timestamp: Date;               // 스냅샷 시점
  description: string;           // 설명 (예: "아이디어 10개 추가")
  memos: Memo[];                 // 메모 전체 복사
  ideas: Idea[];                 // 아이디어 전체 복사
  connections: Connection[];     // 연결 전체 복사
  categories: Category[];        // 범주 전체 복사
  stats: {
    totalMemos: number;
    totalIdeas: number;
    totalConnections: number;
  };
}
```

### 6. Settings (설정)
```typescript
interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  graphLayout: '2d' | '3d';
  autoSaveInterval: number;           // 분 단위
  maxVersionSnapshots: number;        // 기본 10
  similarityThreshold: number;        // 최소 유사도 (0-1)
  enabledIdeaTypes: IdeaType[];       // 활성화된 타입
  categorySuggestionThreshold: number; // 범주 추천 최소 메모 수 (기본 100)
}
```

### IndexedDB 스키마
```typescript
// Dexie 스키마 정의
class IdeaConnectDB extends Dexie {
  memos!: Table<Memo, string>;
  ideas!: Table<Idea, string>;
  connections!: Table<Connection, string>;
  categories!: Table<Category, string>;
  versions!: Table<VersionSnapshot, string>;

  constructor() {
    super('IdeaConnectDB');
    this.version(1).stores({
      memos: 'id, createdAt, updatedAt, *tags, categoryId',
      ideas: 'id, memoId, type, similarity, createdAt',
      connections: 'id, memoId, ideaId, strength, createdAt',
      categories: 'id, createdAt, *memoIds',
      versions: 'id, timestamp'
    });
  }
}
```

---

## 주요 기능 명세

### 1. 메모 관리

#### 1.1 메모 작성/수정
- **마크다운 에디터**
  - 실시간 미리보기
  - 단축키: Ctrl+B (굵게), Ctrl+I (기울임)
  - 자동 저장 (5초마다)
- **태그 입력**
  - 자동완성 지원
  - 쉼표 또는 엔터로 구분
- **제목 자동 생성**
  - 내용 첫 줄에서 자동 추출
  - 수동 편집 가능

#### 1.2 메모 검색
- **전체 텍스트 검색**
  - 제목 + 내용 검색
  - 태그 필터
  - 범주 필터
- **정렬 옵션**
  - 최신순
  - 연결 많은 순
  - 제목 가나다순

### 2. 아이디어 연결

#### 2.1 자동 연결 프로세스
```
메모 저장
  ↓
키워드 추출 (KeywordExtractor)
  ↓
다중 API 검색 (병렬)
  ├── Quotable API
  ├── Wikipedia API
  ├── Google Books API
  └── 한국 속담 DB
  ↓
유사도 계산 (SimilarityCalculator)
  ↓
필터링 (threshold 이상만)
  ↓
연결성 검증
  ├── 최소 1개 이상 연결?
  │   ├── Yes → 저장
  │   └── No → 아이디어 즉시 삭제
```

#### 2.2 키워드 추출 알고리즘
```typescript
function extractKeywords(text: string): string[] {
  // 1. 명사 추출 (한글/영문)
  // 2. 불용어 제거 (조사, 관사 등)
  // 3. TF-IDF 점수 계산
  // 4. 상위 5개 키워드 선택
  // 5. 메모 태그도 키워드에 포함
}
```

#### 2.3 유사도 계산
```typescript
function calculateSimilarity(memo: Memo, idea: Idea): number {
  // 1. Cosine Similarity (키워드 벡터)
  // 2. Jaccard Similarity (단어 집합)
  // 3. 가중 평균 (0.7 : 0.3)
  // 4. 태그 매칭 시 +0.1 보너스
  return score; // 0.0 ~ 1.0
}
```

#### 2.4 연결성 검증
- **최소 유사도**: 0.4 이상 (설정에서 조정 가능)
- **최소 연결 수**: 1개 이상
- **비추천 아이디어 처리**:
  - 연결 실패 시 즉시 삭제
  - 사용자에게 알림 표시

#### 2.5 아이디어 필터
- 타입별 필터 (10가지)
- 전체 선택/해제
- 선택한 타입만 검색

### 3. 그래프 뷰

#### 3.1 시각화 설정
```typescript
interface GraphConfig {
  // 레이아웃
  layout: {
    type: 'force-directed';    // Force-directed 알고리즘
    linkDistance: 80;          // 링크 거리
    chargeStrength: -200;      // 반발력
    centerStrength: 0.3;       // 중심 인력
  };

  // 노드
  node: {
    memo: {
      size: 8;                 // 메모 노드 크기
      color: '#667eea';        // 보라색
      label: true;             // 레이블 표시
    };
    idea: {
      size: 5;                 // 아이디어 노드 크기
      colorByType: true;       // 타입별 색상
      label: false;            // 호버 시만 표시
    };
  };

  // 링크
  link: {
    width: (connection) => connection.strength * 3;  // 강도에 비례
    opacity: 0.6;
    color: '#d1d5db';
  };
}
```

#### 3.2 인터랙션
- **호버**: 노드 정보 툴팁 표시
- **클릭**: 메모 상세 보기로 이동
- **드래그**: 노드 위치 이동
- **줌**: 마우스 휠
- **패닝**: 마우스 드래그 (빈 공간)
- **더블클릭**: 연결된 노드만 필터링

#### 3.3 성능 최적화
- **LOD (Level of Detail)**:
  - 줌 아웃 시 레이블 숨김
  - 노드 100개 이상 시 간소화 렌더링
- **가상화**:
  - 화면 밖 노드 렌더링 스킵
- **WebGL 렌더링**:
  - react-force-graph의 WebGL 모드 사용

### 4. 범주화 추천

#### 4.1 트리거 조건
- 메모 100개 이상
- 범주화되지 않은 메모 30개 이상
- 사용자가 수동으로 요청

#### 4.2 클러스터링 알고리즘
```typescript
function clusterMemos(memos: Memo[]): Category[] {
  // 1. 메모 간 유사도 행렬 생성
  const similarityMatrix = buildSimilarityMatrix(memos);

  // 2. K-Means 클러스터링 (K=자동 결정)
  const clusters = kMeansClustering(similarityMatrix);

  // 3. 각 클러스터의 대표 키워드 추출
  const categories = clusters.map(cluster => ({
    name: extractRepresentativeKeyword(cluster),
    memoIds: cluster.map(m => m.id),
    commonThemes: extractCommonThemes(cluster)
  }));

  return categories;
}
```

#### 4.3 추천 UI
- **패널 표시**: "🎯 범주 추천이 있습니다"
- **미리보기**: 각 범주별 메모 수, 주제 키워드
- **액션**:
  - "적용하기": 범주 생성
  - "무시하기": 추천 닫기
  - "수정하기": 범주명 변경, 메모 재배치

### 5. 버전 관리

#### 5.1 스냅샷 생성 시점
- **자동 생성**:
  - 메모 10개 추가마다
  - 아이디어 50개 추가마다
  - 범주 적용 시
- **수동 생성**:
  - 사용자가 "스냅샷 생성" 버튼 클릭

#### 5.2 스냅샷 제한
- 최대 10개 유지
- 가장 오래된 것부터 자동 삭제
- 사용자가 "고정" 표시한 것은 삭제 안 됨

#### 5.3 복원 프로세스
```
버전 목록 표시
  ↓
사용자 선택
  ↓
변경사항 미리보기 (Diff)
  ├── 추가될 메모: N개
  ├── 삭제될 메모: M개
  └── 수정될 메모: K개
  ↓
확인 요청
  ↓
현재 상태 스냅샷 자동 생성
  ↓
선택한 버전으로 복원
```

### 6. 검색 엔진

#### 6.1 API 통합
```typescript
class SearchService {
  async searchAllSources(
    keywords: string[],
    types: IdeaType[]
  ): Promise<Idea[]> {
    const promises = [];

    if (types.includes('famous-quote')) {
      promises.push(this.searchQuotable(keywords));
    }
    if (types.includes('academic')) {
      promises.push(this.searchWikipedia(keywords));
    }
    if (types.includes('book')) {
      promises.push(this.searchGoogleBooks(keywords));
    }
    if (types.includes('proverb')) {
      promises.push(this.searchProverbs(keywords));
    }

    const results = await Promise.all(promises);
    return results.flat();
  }
}
```

#### 6.2 캐싱 전략
- **메모리 캐시**: 최근 검색 결과 100개
- **IndexedDB 캐시**: 모든 검색 결과 저장
- **TTL**: 7일 (일주일 후 재검색)

---

## UI/UX 설계

### 레이아웃

#### 데스크톱 (1024px+)
```
┌──────────────────────────────────────────────┐
│ Header (Logo, Search, Version)                │
├─────────┬────────────────────────────────────┤
│ Sidebar │ Main View                          │
│         │                                    │
│ Memo    │ [Tab: Detail | Graph]              │
│ List    │                                    │
│         │ • Detail: Editor + Ideas           │
│ (300px) │ • Graph: Force Graph               │
│         │                                    │
│         │                                    │
└─────────┴────────────────────────────────────┘
```

#### 태블릿 (768px - 1023px)
```
┌──────────────────────────────────────┐
│ Header                                │
├──────────────────────────────────────┤
│ Main View (Full Width)                │
│                                      │
│ • Sidebar 숨김 (토글 버튼으로 열기)     │
│ • Tab 유지                            │
└──────────────────────────────────────┘
```

#### 모바일 (< 768px)
```
┌──────────────┐
│ Header       │
├──────────────┤
│ Main View    │
│ (Stack)      │
│              │
│ • 단일 컬럼   │
│ • 탭 하단    │
└──────────────┘
```

### 색상 팔레트 (미니멀)

#### Light Mode
```css
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--text-primary: #111827;
--text-secondary: #6b7280;
--border: #e5e7eb;
--accent: #667eea;
```

#### Dark Mode
```css
--bg-primary: #111827;
--bg-secondary: #1f2937;
--text-primary: #f9fafb;
--text-secondary: #9ca3af;
--border: #374151;
--accent: #8b5cf6;
```

### 타입별 아이디어 색상
```css
--idea-movie: #ef4444;
--idea-drama: #ec4899;
--idea-animation: #f59e0b;
--idea-book: #3b82f6;
--idea-essay: #06b6d4;
--idea-poem: #14b8a6;
--idea-famous-quote: #8b5cf6;
--idea-proverb: #4f46e5;
--idea-academic: #10b981;
--idea-web: #14b8a6;
```

### 타이포그래피
```css
/* 한글: Pretendard */
/* 영문: Inter */
font-family: 'Pretendard', 'Inter', -apple-system, sans-serif;

/* 크기 */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
```

### 애니메이션
- **메모 카드 호버**: `transform: scale(1.02)`, `transition: 0.15s`
- **그래프 노드 호버**: `opacity: 1`, 툴팁 fade-in
- **모달 등장**: `opacity 0→1`, `scale(0.95)→(1)`, `0.2s ease-out`
- **탭 전환**: `fade-in-out`, `0.15s`

---

## 구현 단계

### Phase 1: 프로젝트 셋업 (1일)
**목표**: React + TypeScript 환경 구축

- [ ] Vite 프로젝트 생성
- [ ] TypeScript 설정
- [ ] TailwindCSS 설정
- [ ] 폴더 구조 생성
- [ ] 기본 컴포넌트 (Header, Sidebar, Layout)
- [ ] 라우팅 (React Router)

**산출물**: 빈 화면이지만 네비게이션 가능한 앱

---

### Phase 2: 데이터 레이어 (1-2일)
**목표**: IndexedDB 스키마 및 CRUD 구현

- [ ] Dexie 설치 및 설정
- [ ] 데이터 모델 타입 정의 (`types/`)
- [ ] IndexedDB 스키마 작성 (`db/schema.ts`)
- [ ] 쿼리 함수 작성 (`db/queries/`)
- [ ] Zustand 스토어 생성
  - [ ] memoStore
  - [ ] ideaStore
  - [ ] connectionStore
  - [ ] uiStore

**산출물**: 데이터 저장/조회 가능

---

### Phase 3: 메모 기본 기능 (2일)
**목표**: 메모 CRUD + 마크다운 에디터

- [ ] MemoList 컴포넌트
  - [ ] 메모 카드 표시
  - [ ] 정렬/필터
  - [ ] 무한 스크롤 또는 페이지네이션
- [ ] MemoEditor 컴포넌트
  - [ ] 마크다운 입력 (textarea)
  - [ ] 실시간 미리보기 (react-markdown)
  - [ ] 자동 저장
- [ ] 메모 상세 뷰
  - [ ] 제목/내용 표시
  - [ ] 수정/삭제 버튼
  - [ ] 태그 표시
- [ ] 검색 기능
  - [ ] 전체 텍스트 검색
  - [ ] 태그 필터

**산출물**: 기본 노트 앱 동작

---

### Phase 4: 아이디어 검색 및 연결 (2-3일)
**목표**: 외부 API 통합 + 자동 연결

- [ ] SearchService 구현
  - [ ] Quotable API
  - [ ] Wikipedia API
  - [ ] Google Books API
  - [ ] 한국 속담 DB (JSON)
- [ ] KeywordExtractor
  - [ ] 명사 추출
  - [ ] TF-IDF 계산
- [ ] SimilarityCalculator
  - [ ] Cosine Similarity
  - [ ] Jaccard Similarity
- [ ] 연결 프로세스
  - [ ] 메모 저장 시 자동 검색
  - [ ] 유사도 필터링
  - [ ] 연결성 검증
  - [ ] 비추천 아이디어 삭제
- [ ] IdeaCard 컴포넌트
  - [ ] 아이디어 표시
  - [ ] 출처 정보
  - [ ] 유사도 점수
  - [ ] 피드백 버튼 (👍/👎)
- [ ] IdeaFilter 컴포넌트
  - [ ] 타입별 필터
  - [ ] 전체 선택/해제

**산출물**: 메모 작성 시 자동으로 관련 아이디어 표시

---

### Phase 5: 그래프 뷰 (2-3일)
**목표**: 옵시디언 스타일 그래프 시각화

- [ ] react-force-graph 설치 및 설정
- [ ] GraphBuilder
  - [ ] 노드/링크 데이터 구성
  - [ ] 색상/크기 계산
- [ ] GraphView 컴포넌트
  - [ ] Force Graph 렌더링
  - [ ] 노드 클릭 → 메모 상세
  - [ ] 호버 툴팁
  - [ ] 줌/팬 컨트롤
- [ ] GraphControls
  - [ ] 2D/3D 전환
  - [ ] 레이아웃 재계산
  - [ ] 필터 (타입별)
  - [ ] 범례
- [ ] 성능 최적화
  - [ ] LOD 구현
  - [ ] 가상화
  - [ ] WebGL 모드

**산출물**: 동작하는 그래프 뷰

---

### Phase 6: 범주화 (1-2일)
**목표**: 메모 100개 이상 시 범주 추천

- [ ] ClusteringService
  - [ ] 유사도 행렬 생성
  - [ ] K-Means 클러스터링
  - [ ] 대표 키워드 추출
- [ ] CategoryRecommender
  - [ ] 추천 트리거 감지
  - [ ] 범주 생성
- [ ] CategoryPanel 컴포넌트
  - [ ] 추천 표시
  - [ ] 적용/무시 버튼
  - [ ] 수정 UI
- [ ] 그래프에 범주 표시
  - [ ] 범주별 색상 구분
  - [ ] 범주 경계선

**산출물**: 범주화 추천 및 적용

---

### Phase 7: 버전 관리 (1-2일)
**목표**: 스냅샷 생성 및 복원

- [ ] SnapshotService
  - [ ] 스냅샷 생성
  - [ ] 스냅샷 저장 (IndexedDB)
  - [ ] 오래된 스냅샷 자동 삭제
- [ ] DiffCalculator
  - [ ] 변경사항 계산
  - [ ] 미리보기 생성
- [ ] VersionHistory 컴포넌트
  - [ ] 스냅샷 목록
  - [ ] 타임라인 UI
  - [ ] 고정 기능
- [ ] VersionRestore 컴포넌트
  - [ ] Diff 미리보기
  - [ ] 복원 확인
  - [ ] 복원 실행

**산출물**: 버전 되돌리기 기능

---

### Phase 8: UI/UX 개선 (1-2일)
**목표**: 미니멀 디자인 완성

- [ ] 다크 모드
- [ ] 반응형 디자인
  - [ ] 모바일 최적화
  - [ ] 태블릿 레이아웃
- [ ] 로딩 상태
  - [ ] 스켈레톤 UI
  - [ ] 프로그레스 바
- [ ] 에러 처리
  - [ ] 토스트 알림
  - [ ] 에러 바운더리
- [ ] 단축키
  - [ ] Ctrl+N: 새 메모
  - [ ] Ctrl+S: 저장
  - [ ] Ctrl+F: 검색
  - [ ] Ctrl+Z: 되돌리기
- [ ] 온보딩
  - [ ] 첫 실행 시 튜토리얼
  - [ ] 샘플 메모 제공

**산출물**: 완성도 높은 UI

---

### Phase 9: 테스트 및 최적화 (1일)
**목표**: 안정성 및 성능 확보

- [ ] 단위 테스트 (Vitest)
  - [ ] 유틸 함수
  - [ ] 스토어
- [ ] 통합 테스트
  - [ ] 메모 CRUD
  - [ ] 아이디어 연결
- [ ] E2E 테스트 (Playwright)
  - [ ] 주요 사용자 플로우
- [ ] 성능 테스트
  - [ ] 메모 1000개 로드
  - [ ] 그래프 500노드
- [ ] 번들 크기 최적화
  - [ ] 코드 스플리팅
  - [ ] Tree shaking 확인

**산출물**: 안정적이고 빠른 앱

---

### Phase 10: 배포 (0.5일)
**목표**: GitHub Pages 배포

- [ ] Vite 빌드 설정
- [ ] GitHub Actions 워크플로우
- [ ] 배포 스크립트
- [ ] README 작성

**산출물**: 실제 사용 가능한 웹앱

---

## 성능 최적화

### 1. 번들 크기
- **목표**: < 500KB (gzipped < 150KB)
- **전략**:
  - 코드 스플리팅 (React.lazy)
  - Tree shaking
  - 필요한 라이브러리만 import

### 2. 렌더링 성능
- **메모 목록**: React.memo + 가상 스크롤
- **그래프**: WebGL 렌더링, LOD
- **마크다운**: 디바운싱 (300ms)

### 3. 데이터 로딩
- **IndexedDB**: 인덱스 활용, 페이지네이션
- **API 요청**: 캐싱, 병렬 처리
- **이미지**: 없음 (텍스트만)

### 4. 메모리
- **스냅샷**: 압축 저장 (JSON.stringify)
- **오래된 데이터**: 자동 정리
- **캐시**: LRU 정책

---

## 향후 확장성

### v2.0 기능
- [ ] AI 범주화 (Claude/GPT API 활용)
- [ ] 메모 간 자동 링크 추천
- [ ] 협업 기능 (공유 링크)
- [ ] 익스포트 (Markdown, JSON, PDF)

### v3.0 기능
- [ ] 모바일 앱 (React Native)
- [ ] 클라우드 동기화 (optional)
- [ ] 플러그인 시스템
- [ ] 음성 메모

### 기술 부채 관리
- 매 Phase마다 리팩토링 시간 확보
- 타입 커버리지 80% 이상 유지
- 문서화 (주석, README)

---

## 참고 자료

- [Obsidian Graph View](https://help.obsidian.md/Plugins/Graph+view)
- [react-force-graph Docs](https://github.com/vasturiano/react-force-graph)
- [Dexie.js Guide](https://dexie.org/docs/Tutorial/React)
- [Quotable API](https://github.com/lukePeavey/quotable)
- [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page)
- [Google Books API](https://developers.google.com/books)

---

**문서 버전**: 1.0
**작성일**: 2025-01-08
**다음 업데이트**: Phase 1 완료 후
