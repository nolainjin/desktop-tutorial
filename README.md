# 💡 IdeaConnect

**당신의 아이디어를 세상의 지혜와 연결합니다**

IdeaConnect는 아이디어를 메모하면 관련된 명언, 웹 자료, 영화 대사 등을 찾아서 연결해주는 지성증폭 메모 서비스입니다.

## ✨ 주요 기능

- 📝 **아이디어 작성/관리**: 생각을 자유롭게 기록하고 관리
- 🔍 **지능형 연결**: 관련된 명언, 웹 자료, 영화 대사 자동 검색
- 📦 **출처 정보**: 모든 연결에 저자, 제목, 연도, 링크 등 명확한 출처 표시
- 👍 **피드백 시스템**: 연결의 관련성에 대한 피드백 제공
- 💾 **로컬 저장**: LocalStorage를 사용한 데이터 저장
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🎨 특징

### 타입별 구분
- 💬 **명언/속담**: 인디고 색상
- 🌐 **웹 자료**: 초록 색상
- 🎬 **영화 대사**: 빨강 색상
- 📝 **내 메모**: 보라 색상

### 출처 정보 표시
모든 연결에는 다음 정보가 포함됩니다:
- ✍️ 저자/작가
- 📚 제목/출처
- 📅 연도
- 🔗 웹 링크 (클릭 가능)
- 🏷️ 카테고리/분류

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173/ 을 열어주세요.

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 📁 프로젝트 구조

```
idea-connect/
├── index.html              # 메인 HTML
├── package.json            # 프로젝트 설정
├── src/
│   ├── app.js             # 메인 앱 로직
│   ├── components/
│   │   ├── ConnectionCard.js   # 연결 카드 컴포넌트
│   │   ├── IdeaDetail.js      # 아이디어 상세 컴포넌트
│   │   └── IdeaList.js        # 아이디어 목록 컴포넌트
│   ├── data/
│   │   └── mockData.js        # Mock 데이터 및 데이터 관리
│   ├── utils/
│   │   └── validation.js      # 유효성 검증
│   └── styles/
│       └── main.css           # 스타일
└── README.md
```

## 💻 기술 스택

- **Vanilla JavaScript**: React 없이 순수 JS로 구현
- **Vite**: 빠른 개발 서버 및 빌드 도구
- **CSS3**: 모던 CSS (Grid, Flexbox, CSS Variables)
- **LocalStorage**: 클라이언트 측 데이터 저장

## 🎯 사용 방법

1. **아이디어 작성**: "새 아이디어 작성" 버튼을 클릭하여 생각을 기록
2. **연결 찾기**: 아이디어 상세 화면에서 "연결 찾기" 버튼 클릭
3. **결과 확인**: 관련된 명언, 웹 자료, 영화 대사 확인
4. **피드백**: 👍/👎 버튼으로 연결의 관련성 평가
5. **출처 확인**: 각 연결의 출처 정보 박스에서 자세한 정보 확인

## 📊 데이터 구조

### Idea (아이디어)
```javascript
{
  id: string,
  title: string,
  content: string,
  createdAt: string,
  tags: string[]
}
```

### Connection (연결)
```javascript
{
  id: string,
  ideaId: string,
  type: "quote" | "web" | "movie" | "memo",
  content: string,
  source: {
    author: string | null,
    title: string | null,
    year: string | null,
    url: string | null,
    category: string | null,
    platform: string | null
  },
  similarity: number,
  reasoning: string,
  userFeedback: "up" | "down" | null
}
```

## 🔧 향후 개선 사항

- [ ] 실제 AI API 연동 (OpenAI, Claude 등)
- [ ] 실제 검색 API 연동 (명언, 웹, 영화)
- [ ] 사용자 인증 및 클라우드 동기화
- [ ] 연결 그래프 시각화
- [ ] 태그 자동 추출
- [ ] 내보내기 기능 (PDF, Markdown)
- [ ] 다크 모드 지원

## 📄 라이선스

MIT

## 🤝 기여

기여는 언제나 환영합니다! Pull Request를 보내주세요.

## 📧 문의

이슈가 있으시면 GitHub Issues를 통해 알려주세요.

---

**Made with Claude Code** ✨
