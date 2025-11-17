import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchQuotes } from './QuotableAPI';

describe('QuotableAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('명언 검색 결과를 반환해야 함', async () => {
    const mockQuotes = [
      {
        content: 'Success is the sum of small efforts repeated day in and day out.',
        author: 'Robert Collier',
        tags: ['success']
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuotes
    } as Response);

    const results = await searchQuotes(['성장', '습관']);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('famous-quote');
    expect(results[0].content).toBeDefined();
    expect(results[0].source?.author).toBeDefined();
  });

  it('한글 키워드를 영어로 매핑해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    await searchQuotes(['성장']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('tags=growth')
    );
  });

  it('여러 키워드 중 첫 번째 매핑 가능한 것을 사용해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    await searchQuotes(['알수없음', '습관', '성장']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('tags=habit')
    );
  });

  it('매핑 불가능한 키워드는 life를 기본값으로 사용해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    await searchQuotes(['알수없는키워드', '매핑안됨']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('tags=life')
    );
  });

  it('최대 3개의 명언을 요청해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    await searchQuotes(['성공']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('limit=3')
    );
  });

  it('API 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    const results = await searchQuotes(['test']);

    expect(results).toEqual([]);
  });

  it('네트워크 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const results = await searchQuotes(['test']);

    expect(results).toEqual([]);
  });

  it('모든 주요 키워드를 매핑할 수 있어야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    } as Response);

    const keywordTests = [
      { korean: '성장', english: 'growth' },
      { korean: '습관', english: 'habit' },
      { korean: '실패', english: 'failure' },
      { korean: '성공', english: 'success' },
      { korean: '친구', english: 'friendship' },
      { korean: '사랑', english: 'love' },
      { korean: '행복', english: 'happiness' },
      { korean: '배움', english: 'learning' },
      { korean: '지혜', english: 'wisdom' }
    ];

    for (const test of keywordTests) {
      vi.clearAllMocks();
      await searchQuotes([test.korean]);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`tags=${test.english}`)
      );
    }
  });

  it('유사도 점수를 설정해야 함', async () => {
    const mockQuotes = [
      {
        content: 'Test quote',
        author: 'Test Author',
        tags: ['test']
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuotes
    } as Response);

    const results = await searchQuotes(['성장']);

    if (results.length > 0) {
      expect(results[0].similarity).toBeGreaterThanOrEqual(0.75);
      expect(results[0].similarity).toBeLessThanOrEqual(0.95);
    }
  });

  it('reasoning 메시지를 포함해야 함', async () => {
    const mockQuotes = [
      {
        content: 'Success is built on habits.',
        author: 'John Doe',
        tags: ['success']
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuotes
    } as Response);

    const results = await searchQuotes(['성장', '습관']);

    if (results.length > 0) {
      expect(results[0].reasoning).toBeDefined();
      expect(results[0].reasoning).toContain('성장');
      expect(results[0].reasoning).toContain('습관');
      expect(results[0].reasoning).toContain('John Doe');
    }
  });

  it('source 정보를 올바르게 설정해야 함', async () => {
    const mockQuotes = [
      {
        content: 'Wisdom is power.',
        author: 'Francis Bacon',
        tags: ['wisdom']
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuotes
    } as Response);

    const results = await searchQuotes(['지혜']);

    if (results.length > 0) {
      const source = results[0].source!;
      expect(source.author).toBe('Francis Bacon');
      expect(source.category).toBe('위인 명언');
    }
  });

  it('여러 명언을 반환할 수 있어야 함', async () => {
    const mockQuotes = [
      {
        content: 'Quote 1',
        author: 'Author 1',
        tags: ['success']
      },
      {
        content: 'Quote 2',
        author: 'Author 2',
        tags: ['success']
      },
      {
        content: 'Quote 3',
        author: 'Author 3',
        tags: ['success']
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockQuotes
    } as Response);

    const results = await searchQuotes(['성공']);

    expect(results).toHaveLength(3);
    results.forEach((result, index) => {
      expect(result.content).toBe(`Quote ${index + 1}`);
      expect(result.source?.author).toBe(`Author ${index + 1}`);
    });
  });
});
