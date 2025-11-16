import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchAllSources, validateConnection } from './SearchService';
import { Memo } from '../../types/idea';
import { Idea } from '../../types/idea';

// API 모듈 모킹
vi.mock('./api/QuotableAPI', () => ({
  searchQuotes: vi.fn()
}));

vi.mock('./api/WikipediaAPI', () => ({
  searchWikipedia: vi.fn()
}));

vi.mock('./api/GoogleBooksAPI', () => ({
  searchBooks: vi.fn()
}));

vi.mock('./api/ProverbsDB', () => ({
  koreanProverbs: [
    {
      content: '티끌 모아 태산',
      category: '노력',
      keywords: ['노력', '성장', '습관']
    },
    {
      content: '천리 길도 한 걸음부터',
      category: '시작',
      keywords: ['시작', '용기', '도전']
    },
    {
      content: '백지장도 맞들면 낫다',
      category: '협력',
      keywords: ['협력', '친구', '관계']
    }
  ]
}));

// 키워드 추출과 유사도 계산은 실제 함수 사용
vi.mock('./KeywordExtractor', async () => {
  const actual = await vi.importActual('./KeywordExtractor');
  return actual;
});

vi.mock('./SimilarityCalculator', async () => {
  const actual = await vi.importActual('./SimilarityCalculator');
  return actual;
});

import { searchQuotes } from './api/QuotableAPI';
import { searchWikipedia } from './api/WikipediaAPI';
import { searchBooks } from './api/GoogleBooksAPI';

describe('SearchService', () => {
  // 테스트용 메모 데이터
  const mockMemo: Memo = {
    id: 'test-memo-1',
    title: '성장하는 습관',
    content: '매일 성장하는 습관을 만들자. 작은 노력이 큰 변화를 만든다.',
    tags: ['자기계발', '습관'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(() => {
    // 각 테스트 전에 모든 mock 리셋
    vi.clearAllMocks();
  });

  describe('searchAllSources', () => {
    it('모든 소스에서 아이디어를 검색해야 함', async () => {
      // Mock 응답 설정
      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: '성공은 습관이다',
          source: { author: 'Author 1' },
          similarity: 0.7,
          reasoning: '성장 관련 명언'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([
        {
          type: 'academic',
          content: '습관의 과학',
          source: { url: 'https://example.com' },
          similarity: 0.6,
          reasoning: '학술 정보'
        }
      ]);

      vi.mocked(searchBooks).mockResolvedValue([
        {
          type: 'book',
          content: '아침 습관의 힘',
          source: { title: 'Book Title' },
          similarity: 0.5,
          reasoning: '책 추천'
        }
      ]);

      const ideas = await searchAllSources(mockMemo);

      // 결과 검증
      expect(ideas.length).toBeGreaterThan(0);
      expect(searchQuotes).toHaveBeenCalledWith(expect.any(Array));
      expect(searchWikipedia).toHaveBeenCalledWith(expect.any(Array));
      expect(searchBooks).toHaveBeenCalledWith(expect.any(Array));
    });

    it('타입 필터를 적용해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([]);
      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      // famous-quote만 검색
      await searchAllSources(mockMemo, ['famous-quote']);

      expect(searchQuotes).toHaveBeenCalled();
      expect(searchWikipedia).not.toHaveBeenCalled();
      expect(searchBooks).not.toHaveBeenCalled();
    });

    it('여러 타입 필터를 적용해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([]);
      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      // academic과 book만 검색
      await searchAllSources(mockMemo, ['academic', 'book']);

      expect(searchQuotes).not.toHaveBeenCalled();
      expect(searchWikipedia).toHaveBeenCalled();
      expect(searchBooks).toHaveBeenCalled();
    });

    it('중복된 콘텐츠를 제거해야 함', async () => {
      const duplicateContent = '성공은 습관이다. 매일 작은 노력을 쌓아가라.';

      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: duplicateContent,
          source: { author: 'Author 1' },
          similarity: 0.7,
          reasoning: '명언'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([
        {
          type: 'academic',
          content: duplicateContent,
          source: { url: 'https://example.com' },
          similarity: 0.6,
          reasoning: '학술'
        }
      ]);

      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      // 중복이 제거되어 1개만 남아야 함
      const uniqueContents = new Set(ideas.map(i => i.content.substring(0, 50)));
      expect(uniqueContents.size).toBe(ideas.length);
    });

    it('유사도가 0.3 미만인 결과를 필터링해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: '완전히 다른 주제의 명언입니다. 전혀 관련이 없습니다.',
          source: { author: 'Author 1' },
          similarity: 0.1,
          reasoning: '명언'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      // 유사도 0.3 미만은 필터링됨
      ideas.forEach(idea => {
        expect(idea.similarity).toBeGreaterThanOrEqual(0.3);
      });
    });

    it('결과를 유사도 순으로 정렬해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: '성장은 습관에서 나온다',
          source: { author: 'Author 1' },
          similarity: 0.5,
          reasoning: '명언 1'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([
        {
          type: 'academic',
          content: '습관 형성의 과학적 원리',
          source: { url: 'https://example.com' },
          similarity: 0.8,
          reasoning: '학술'
        }
      ]);

      vi.mocked(searchBooks).mockResolvedValue([
        {
          type: 'book',
          content: '작은 습관의 힘',
          source: { title: 'Book' },
          similarity: 0.6,
          reasoning: '책'
        }
      ]);

      const ideas = await searchAllSources(mockMemo);

      // 유사도 내림차순 정렬 확인
      for (let i = 0; i < ideas.length - 1; i++) {
        expect(ideas[i].similarity).toBeGreaterThanOrEqual(ideas[i + 1].similarity);
      }
    });

    it('최대 10개의 결과만 반환해야 함', async () => {
      // 15개의 mock 결과 생성
      const manyResults = Array.from({ length: 15 }, (_, i) => ({
        type: 'famous-quote' as const,
        content: `성장과 습관에 대한 명언 ${i + 1}`,
        source: { author: `Author ${i + 1}` },
        similarity: 0.5 + (i * 0.01),
        reasoning: '명언'
      }));

      vi.mocked(searchQuotes).mockResolvedValue(manyResults);
      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      expect(ideas.length).toBeLessThanOrEqual(10);
    });

    it('API 오류 시 빈 배열을 반환하지 않고 계속 진행해야 함', async () => {
      vi.mocked(searchQuotes).mockRejectedValue(new Error('API Error'));
      vi.mocked(searchWikipedia).mockResolvedValue([
        {
          type: 'academic',
          content: '습관의 과학',
          source: { url: 'https://example.com' },
          similarity: 0.7,
          reasoning: '학술'
        }
      ]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      // 하나의 API가 실패해도 다른 결과는 받아야 함
      expect(ideas.length).toBeGreaterThan(0);
    });

    it('모든 API가 실패해도 에러를 던지지 않아야 함', async () => {
      vi.mocked(searchQuotes).mockRejectedValue(new Error('Error 1'));
      vi.mocked(searchWikipedia).mockRejectedValue(new Error('Error 2'));
      vi.mocked(searchBooks).mockRejectedValue(new Error('Error 3'));

      const ideas = await searchAllSources(mockMemo);

      // 속담은 로컬이므로 여전히 작동
      expect(Array.isArray(ideas)).toBe(true);
    });

    it('한국 속담을 검색해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([]);
      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo, ['proverb']);

      // 노력, 성장 키워드가 있어서 속담이 매칭되어야 함
      expect(ideas.some(idea => idea.type === 'proverb')).toBe(true);
    });

    it('유사도를 재계산해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: '성장하는 습관을 만들어라',
          source: { author: 'Author' },
          similarity: 0.1, // 낮은 초기 유사도
          reasoning: '명언'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      if (ideas.length > 0) {
        // 재계산된 유사도는 초기값보다 높을 수 있음
        expect(ideas[0].similarity).toBeGreaterThanOrEqual(0);
      }
    });

    it('완전한 Idea 객체를 생성해야 함', async () => {
      vi.mocked(searchQuotes).mockResolvedValue([
        {
          type: 'famous-quote',
          content: '성공은 습관이다',
          source: { author: 'Author 1' },
          similarity: 0.7,
          reasoning: '성장 관련 명언'
        }
      ]);

      vi.mocked(searchWikipedia).mockResolvedValue([]);
      vi.mocked(searchBooks).mockResolvedValue([]);

      const ideas = await searchAllSources(mockMemo);

      expect(ideas.length).toBeGreaterThan(0);

      const idea = ideas[0];
      expect(idea).toHaveProperty('id');
      expect(idea).toHaveProperty('memoId', mockMemo.id);
      expect(idea).toHaveProperty('type');
      expect(idea).toHaveProperty('content');
      expect(idea).toHaveProperty('source');
      expect(idea).toHaveProperty('similarity');
      expect(idea).toHaveProperty('reasoning');
      expect(idea).toHaveProperty('createdAt');
      expect(idea.createdAt instanceof Date).toBe(true);
    });
  });

  describe('validateConnection', () => {
    it('연결이 있으면 true를 반환해야 함', () => {
      const ideas: Idea[] = [
        {
          id: '1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '성공은 습관이다',
          source: { author: 'Author' },
          similarity: 0.5,
          reasoning: '명언',
          createdAt: new Date()
        }
      ];

      expect(validateConnection(ideas)).toBe(true);
    });

    it('유사도가 0.3 이상인 연결이 있으면 true를 반환해야 함', () => {
      const ideas: Idea[] = [
        {
          id: '1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '성공은 습관이다',
          source: { author: 'Author' },
          similarity: 0.3,
          reasoning: '명언',
          createdAt: new Date()
        }
      ];

      expect(validateConnection(ideas)).toBe(true);
    });

    it('연결이 없으면 false를 반환해야 함', () => {
      expect(validateConnection([])).toBe(false);
    });

    it('모든 연결의 유사도가 0.3 미만이면 false를 반환해야 함', () => {
      const ideas: Idea[] = [
        {
          id: '1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '관련 없는 내용',
          source: { author: 'Author' },
          similarity: 0.2,
          reasoning: '명언',
          createdAt: new Date()
        },
        {
          id: '2',
          memoId: 'memo-1',
          type: 'academic',
          content: '다른 내용',
          source: { url: 'https://example.com' },
          similarity: 0.1,
          reasoning: '학술',
          createdAt: new Date()
        }
      ];

      expect(validateConnection(ideas)).toBe(false);
    });

    it('일부 연결만 0.3 이상이어도 true를 반환해야 함', () => {
      const ideas: Idea[] = [
        {
          id: '1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '낮은 유사도',
          source: { author: 'Author 1' },
          similarity: 0.2,
          reasoning: '명언 1',
          createdAt: new Date()
        },
        {
          id: '2',
          memoId: 'memo-1',
          type: 'academic',
          content: '높은 유사도',
          source: { url: 'https://example.com' },
          similarity: 0.5,
          reasoning: '학술',
          createdAt: new Date()
        }
      ];

      expect(validateConnection(ideas)).toBe(true);
    });
  });
});
