# IdeaConnect v2 테스트 가이드

## 🧪 테스트 환경 구성

IdeaConnect v2는 **Vitest**와 **React Testing Library**를 사용하여 테스트합니다.

### 설치된 테스트 도구

- **Vitest 4.0**: 빠른 유닛 테스트 프레임워크
- **@testing-library/react**: React 컴포넌트 테스트
- **@testing-library/user-event**: 사용자 인터랙션 시뮬레이션
- **@testing-library/jest-dom**: DOM 매처 확장
- **jsdom**: 브라우저 환경 시뮬레이션

---

## 📋 테스트 스크립트

```bash
# 테스트를 watch 모드로 실행 (개발 중 사용)
npm test

# 테스트를 한 번만 실행 (CI/CD 용)
npm run test:run

# 테스트 UI 실행 (브라우저에서 테스트 확인)
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage
```

---

## 📁 테스트 파일 구조

```
src/
├── __tests__/                          # 통합 테스트
│   └── App.test.tsx                    # App 컴포넌트 테스트
├── components/
│   └── idea/
│       ├── __tests__/
│       │   └── IdeaCard.test.tsx       # IdeaCard 컴포넌트 테스트
│       └── IdeaCard.tsx
├── features/
│   └── search/
│       ├── __tests__/
│       │   ├── SimilarityCalculator.test.ts    # 유사도 계산 유닛 테스트
│       │   └── KeywordExtractor.test.ts        # 키워드 추출 유닛 테스트
│       ├── SimilarityCalculator.ts
│       └── KeywordExtractor.ts
└── test/
    ├── setup.ts                        # 테스트 환경 설정
    └── test-utils.tsx                  # 테스트 헬퍼 함수
```

---

## 🎯 테스트 커버리지

### 현재 테스트 현황

| 카테고리 | 테스트 파일 | 테스트 수 | 상태 |
|---------|-----------|---------|------|
| **유틸리티** | SimilarityCalculator | 11개 | ✅ 통과 |
| **유틸리티** | KeywordExtractor | 9개 | ✅ 통과 |
| **컴포넌트** | IdeaCard | 12개 | ✅ 통과 |
| **통합 테스트** | App | 2개 | ✅ 통과 |
| **전체** | **4개 파일** | **34개** | **✅ 100%** |

---

## 🔍 주요 테스트 케이스

### 1. SimilarityCalculator 테스트

```typescript
// src/features/search/__tests__/SimilarityCalculator.test.ts

describe('calculateSimilarity', () => {
  it('동일한 텍스트는 높은 유사도를 반환해야 함');
  it('완전히 다른 텍스트는 낮은 유사도를 반환해야 함');
  it('공통 키워드가 있으면 유사도가 높아야 함');
  it('태그가 일치하면 보너스 점수를 받아야 함');
  // ... 총 11개 테스트
});
```

### 2. KeywordExtractor 테스트

```typescript
// src/features/search/__tests__/KeywordExtractor.test.ts

describe('extractKeywords', () => {
  it('텍스트에서 주요 키워드를 추출해야 함');
  it('가장 관련성 높은 키워드를 먼저 반환해야 함');
  it('태그를 키워드에 포함해야 함');
  it('중복된 키워드를 제거해야 함');
  // ... 총 9개 테스트
});
```

### 3. IdeaCard 컴포넌트 테스트

```typescript
// src/components/idea/__tests__/IdeaCard.test.tsx

describe('IdeaCard', () => {
  it('아이디어 카드가 렌더링되어야 함');
  it('아이디어 타입 라벨을 표시해야 함');
  it('유사도 퍼센트를 표시해야 함');
  it('출처 정보를 표시해야 함');
  it('관련있음 버튼 클릭 시 onFeedback이 호출되어야 함');
  // ... 총 12개 테스트
});
```

---

## 🛠️ 테스트 작성 가이드

### 유닛 테스트 작성 예시

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('기본 동작을 테스트', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### 컴포넌트 테스트 작성 예시

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('버튼 클릭 테스트', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔧 테스트 설정 파일

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### src/test/setup.ts

테스트 환경 초기화:
- jest-dom 매처 추가
- IndexedDB 모킹
- matchMedia 모킹
- IntersectionObserver 모킹

### src/test/test-utils.tsx

React 컴포넌트 테스트 헬퍼:
- QueryClientProvider 래핑
- BrowserRouter 래핑
- 커스텀 render 함수 제공

---

## 📊 테스트 결과 확인

### 터미널에서 확인

```bash
npm run test:run
```

출력 예시:
```
✓ src/features/search/__tests__/KeywordExtractor.test.ts (9 tests)
✓ src/features/search/__tests__/SimilarityCalculator.test.ts (11 tests)
✓ src/components/idea/__tests__/IdeaCard.test.tsx (12 tests)
✓ src/__tests__/App.test.tsx (2 tests)

Test Files  4 passed (4)
     Tests  34 passed (34)
  Start at  14:29:10
  Duration  6.19s
```

### UI에서 확인

```bash
npm run test:ui
```

브라우저가 자동으로 열리고, 인터랙티브한 테스트 결과를 확인할 수 있습니다.

### 커버리지 리포트

```bash
npm run test:coverage
```

`coverage/` 디렉토리에 HTML 리포트가 생성됩니다.

---

## 🚀 CI/CD 통합

### GitHub Actions 예시

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 💡 테스트 베스트 프랙티스

### ✅ DO (권장)

1. **명확한 테스트 이름 사용**
   ```typescript
   it('사용자가 버튼을 클릭하면 카운터가 증가해야 함', () => {});
   ```

2. **AAA 패턴 따르기** (Arrange, Act, Assert)
   ```typescript
   it('테스트', () => {
     // Arrange: 테스트 준비
     const user = userEvent.setup();

     // Act: 동작 실행
     await user.click(button);

     // Assert: 결과 검증
     expect(counter).toBe(1);
   });
   ```

3. **테스트 격리 유지**
   - 각 테스트는 독립적이어야 함
   - 다른 테스트에 의존하지 않아야 함

4. **의미 있는 assertion 사용**
   ```typescript
   expect(button).toBeInTheDocument();
   expect(text).toHaveTextContent('Hello');
   ```

### ❌ DON'T (지양)

1. **구현 세부사항 테스트**
   ```typescript
   // ❌ 나쁨
   expect(component.state.count).toBe(1);

   // ✅ 좋음
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

2. **너무 많은 것을 한 테스트에서 검증**
   ```typescript
   // ❌ 나쁨 - 하나의 테스트가 너무 많은 것을 검증
   it('모든 기능 테스트', () => {
     // 10개의 다른 검증...
   });

   // ✅ 좋음 - 각 기능을 별도로 테스트
   it('기능 A 테스트', () => {});
   it('기능 B 테스트', () => {});
   ```

3. **비동기 코드를 동기로 처리**
   ```typescript
   // ❌ 나쁨
   user.click(button);
   expect(result).toBe('done');

   // ✅ 좋음
   await user.click(button);
   expect(result).toBe('done');
   ```

---

## 🐛 문제 해결

### IndexedDB 에러

테스트 중 Dexie/IndexedDB 관련 에러가 발생하면:

1. `src/test/setup.ts`에서 IndexedDB가 모킹되어 있는지 확인
2. 필요시 개별 테스트에서 Dexie를 모킹

```typescript
import { vi } from 'vitest';

vi.mock('@/db/schema', () => ({
  db: {
    ideas: { toArray: vi.fn(() => Promise.resolve([])) },
    memos: { toArray: vi.fn(() => Promise.resolve([])) },
  },
}));
```

### React Router 경고

React Router의 Future Flag 경고는 무시해도 됩니다. 실제 기능에는 영향을 주지 않습니다.

### act() 경고

컴포넌트가 비동기 상태 업데이트를 하는 경우:

```typescript
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## 📚 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**작성일**: 2024-11-10
**버전**: v2.0.0
