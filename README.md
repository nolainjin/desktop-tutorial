# 💡 IdeaConnect v2

> 생각을 연결하고, 지혜를 발견하는 지식 네트워크

React + TypeScript로 재작성된 옵시디언 스타일 메모 앱입니다. 메모를 작성하면 자동으로 관련된 명언, 책, 영화, 학문적 내용을 찾아주고, 그래프로 시각화합니다.

## ✨ 주요 기능

### 📝 메모 관리
- 마크다운 지원 (실시간 미리보기)
- 태그 시스템 (쉼표로 구분)
- 자동 저장 (5초마다)
- 검색 (제목 + 내용 전체 검색)

### 🔍 자동 아이디어 연결
- 무료 API 통합: Quotable, Wikipedia, Google Books, 한국 속담 DB
- 스마트 검색: 키워드 자동 추출, 유사도 계산
- 10가지 타입: 영화, 드라마, 애니메이션, 책, 에세이, 시, 명언, 속담, 학문, 웹자료

### 🔗 그래프 뷰
- 옵시디언 스타일 SVG 그래프
- 메모 중심 원형 레이아웃
- 호버/클릭 인터랙션
- 타입별 색상 구분

### 🎨 UI/UX
- 미니멀 디자인 (TailwindCSS)
- 다크 모드 준비
- 반응형 (모바일/태블릿/데스크톱)
- 빠른 성능 (380KB, gzipped 125KB)

## 🚀 시작하기

npm install
npm run dev
npm run build

## 📖 사용 방법

1. 메모 작성
2. 연결 찾기 (자동 아이디어 검색)
3. 그래프 보기 (시각화)

## 🛠️ 기술 스택

React 18, TypeScript, Vite, TailwindCSS, Zustand, IndexedDB (Dexie)

## 📊 데이터 모델

Memo, Idea, Connection

## 📝 라이센스

MIT

Made with Claude Code
