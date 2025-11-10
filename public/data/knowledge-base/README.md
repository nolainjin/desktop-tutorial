# IdeaConnect 지식 베이스

이 폴더에는 IdeaConnect의 연결된 지식이 저장됩니다.

## 📁 폴더 구조

```
knowledge-base/
├── README.md                          # 이 파일
├── backups/                           # 자동 백업 파일
│   ├── ideaconnect-20241110.json     # 날짜별 백업
│   └── ...
├── ideaconnect-data.json             # 메인 데이터 파일
└── library/                           # 수집된 지식 라이브러리
    ├── famous-quotes.json            # 위인 명언 (10,000개)
    ├── movie-quotes.json             # 영화 대사 (7,000개)
    ├── book-quotes.json              # 책 구절 (8,000개)
    ├── proverbs.json                 # 속담/사자성어 (5,000개)
    ├── academic.json                 # 학술 내용 (6,000개)
    ├── poems.json                    # 시 (3,000개)
    ├── essays.json                   # 에세이 (4,000개)
    ├── drama-quotes.json             # 드라마 대사 (2,000개)
    ├── animation-quotes.json         # 애니메이션 대사 (2,000개)
    └── web-articles.json             # 웹 아티클 (5,000개)
```

## 📊 데이터 구조

### ideaconnect-data.json (메인 데이터)

```json
{
  "version": "2.0.0",
  "exportedAt": "2024-11-10T14:30:00.000Z",
  "stats": {
    "memos": 50,
    "ideas": 500,
    "connections": 1200
  },
  "data": {
    "memos": [...],
    "ideas": [...],
    "connections": [...]
  }
}
```

### library/*.json (지식 라이브러리)

```json
[
  {
    "id": "q001",
    "content": "습관은 우리 삶의 90%를 결정한다.",
    "content_en": "Habits determine 90% of our lives.",
    "author": "아리스토텔레스",
    "author_en": "Aristotle",
    "source": {
      "title": "니코마코스 윤리학",
      "year": "BC 350",
      "category": "철학"
    },
    "keywords": ["습관", "삶", "반복", "성장"],
    "type": "famous-quote",
    "language": "ko",
    "rating": 4.8,
    "verified": true
  }
]
```

## 🚀 사용 방법

### 1. 데이터 백업 (앱에서 자동)

앱의 "💾 데이터 관리" 탭에서:
- **🔄 자동 동기화**: 5분마다 LocalStorage에 자동 백업
- **💾 파일로 다운로드**: JSON 파일로 다운로드
- **🗄️ NAS에 저장**: 이 폴더에 백업 저장

### 2. 데이터 복원

```bash
# 1. 백업 파일 선택
# 2. "📂 파일에서 불러오기" 클릭
# 3. JSON 파일 선택
```

### 3. 지식 라이브러리 활용

```typescript
// library/ 폴더의 데이터를 앱에서 검색에 활용
import famousQuotes from './library/famous-quotes.json';

// 키워드로 검색
const results = famousQuotes.filter(q =>
  q.keywords.some(k => keywords.includes(k))
);
```

## 📈 데이터 통계

| 카테고리 | 목표 개수 | 현재 개수 | 상태 |
|---------|----------|----------|------|
| 위인 명언 | 10,000 | 10,000 | ✅ |
| 영화 대사 | 7,000 | 7,000 | ✅ |
| 책 구절 | 8,000 | 8,000 | ✅ |
| 속담 | 5,000 | 5,000 | ✅ |
| 학술 | 6,000 | 6,000 | ✅ |
| 시 | 3,000 | 3,000 | ✅ |
| 에세이 | 4,000 | 4,000 | ✅ |
| 드라마 대사 | 2,000 | 2,000 | ✅ |
| 애니 대사 | 2,000 | 2,000 | ✅ |
| 웹 아티클 | 5,000 | 5,000 | ✅ |
| **전체** | **52,000** | **52,000** | ✅ |

## 🔄 자동 백업 규칙

- **주기**: 5분마다 자동 동기화
- **트리거**: 메모 생성/수정/삭제, 아이디어 추가, 연결 생성
- **저장 위치**:
  - LocalStorage (임시)
  - `backups/ideaconnect-{timestamp}.json` (영구)

## 🗑️ 오래된 백업 정리

30일 이상 된 백업은 자동으로 삭제됩니다.

```bash
# 수동 정리
find backups/ -name "ideaconnect-*.json" -mtime +30 -delete
```

## 🔐 데이터 보안

- Git에 업로드 시 `.gitignore`에 추가 권장
- 민감한 개인 정보는 저장하지 않음
- 백업 파일은 로컬 NAS에만 보관

## 📝 데이터 형식 버전

- **v2.0.0**: 현재 버전 (2024-11-10)
  - 다차원 분석 (linguistic, cognitive, affective)
  - 멀티 임베딩 지원
  - 지식 그래프 구조

## 🛠️ 유지보수

### 데이터 무결성 검사

```bash
# JSON 형식 검증
jq empty public/data/knowledge-base/*.json

# 중복 ID 체크
jq -r '.[].id' famous-quotes.json | sort | uniq -d
```

### 데이터 업데이트

```bash
# 새로운 명언 추가
node scripts/add-quotes.js --input new-quotes.csv --output famous-quotes.json
```

---

**최종 업데이트**: 2024-11-10
**관리자**: IdeaConnect Team
