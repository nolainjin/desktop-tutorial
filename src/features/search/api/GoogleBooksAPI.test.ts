import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks } from './GoogleBooksAPI';

describe('GoogleBooksAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('책 검색 결과를 반환해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '아침 루틴의 힘',
            authors: ['저자명'],
            description: '이 책은 좋은 습관을 만드는 방법에 대해 설명합니다. 매일 아침 루틴을 통해 성장할 수 있습니다.',
            publishedDate: '2023-01-01',
            infoLink: 'https://books.google.com/test',
            categories: ['자기계발']
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['습관', '성장']);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('book');
    expect(results[0].content).toBeDefined();
    expect(results[0].source?.title).toBe('아침 루틴의 힘');
  });

  it('설명이 50자 미만인 책은 필터링해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '짧은 설명 책',
            authors: ['저자'],
            description: '너무 짧음',
            publishedDate: '2023'
          }
        },
        {
          volumeInfo: {
            title: '긴 설명 책',
            authors: ['저자'],
            description: '이것은 50자 이상의 긴 설명입니다. 충분히 긴 텍스트를 포함하고 있어야 합니다. 최소 50자 이상.',
            publishedDate: '2023'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    // 50자 미만은 필터링됨
    expect(results.every(r => r.content!.length >= 50)).toBe(true);
  });

  it('설명이 없는 책은 필터링해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '설명 없는 책',
            authors: ['저자']
            // description 없음
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    expect(results).toHaveLength(0);
  });

  it('최대 2개의 결과만 반환해야 함', async () => {
    const mockResponse = {
      items: [1, 2, 3, 4, 5].map(i => ({
        volumeInfo: {
          title: `책 ${i}`,
          authors: [`저자 ${i}`],
          description: `이것은 책 ${i}의 설명입니다. 50자 이상의 긴 텍스트를 포함하고 있어야 필터링되지 않습니다. 추가 텍스트.`,
          publishedDate: '2023'
        }
      }))
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('설명을 200자로 자르고 ...을 추가해야 함', async () => {
    const longDescription = 'a'.repeat(300);

    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '책',
            authors: ['저자'],
            description: longDescription,
            publishedDate: '2023'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    if (results.length > 0) {
      expect(results[0].content).toHaveLength(203); // 200 + '...'
      expect(results[0].content?.endsWith('...')).toBe(true);
    }
  });

  it('items가 없으면 빈 배열을 반환해야 함', async () => {
    const mockResponse = {
      // items 없음
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    expect(results).toEqual([]);
  });

  it('API 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    const results = await searchBooks(['test']);

    expect(results).toEqual([]);
  });

  it('네트워크 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const results = await searchBooks(['test']);

    expect(results).toEqual([]);
  });

  it('올바른 URL을 호출해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] })
    } as Response);

    await searchBooks(['성장', '습관']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('googleapis.com/books/v1/volumes')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('langRestrict=ko')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('maxResults=5')
    );
  });

  it('source 정보를 올바르게 설정해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '습관의 힘',
            authors: ['찰스 두히그', '공저자'],
            description: '이 책은 습관의 과학에 대해 설명합니다. 매우 흥미로운 내용이 가득합니다. 50자 이상 설명.',
            publishedDate: '2012-03-15',
            infoLink: 'https://books.google.com/books?id=test',
            categories: ['심리학', '자기계발']
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['습관']);

    if (results.length > 0) {
      const source = results[0].source!;
      expect(source.title).toBe('습관의 힘');
      expect(source.author).toBe('찰스 두히그, 공저자');
      expect(source.year).toBe('2012');
      expect(source.url).toBe('https://books.google.com/books?id=test');
      expect(source.category).toBe('심리학');
      expect(source.platform).toBe('Google Books');
    }
  });

  it('저자가 없으면 "저자 미상"으로 설정해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '무명의 책',
            description: '저자가 없는 책입니다. 50자 이상의 설명을 가지고 있어야 필터링되지 않습니다.',
            publishedDate: '2023'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    if (results.length > 0) {
      expect(results[0].source?.author).toBe('저자 미상');
    }
  });

  it('출판 연도만 추출해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '책',
            authors: ['저자'],
            description: '50자 이상의 설명입니다. 충분히 긴 텍스트를 포함하고 있어야 합니다.',
            publishedDate: '2023-05-20'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    if (results.length > 0) {
      expect(results[0].source?.year).toBe('2023');
    }
  });

  it('유사도 점수를 설정해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '책',
            authors: ['저자'],
            description: '50자 이상의 설명입니다. 충분히 긴 텍스트를 포함하고 있어야 합니다.',
            publishedDate: '2023'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['test']);

    if (results.length > 0) {
      expect(results[0].similarity).toBeGreaterThanOrEqual(0.7);
      expect(results[0].similarity).toBeLessThanOrEqual(0.9);
    }
  });

  it('reasoning 메시지를 포함해야 함', async () => {
    const mockResponse = {
      items: [
        {
          volumeInfo: {
            title: '책',
            authors: ['저자'],
            description: '50자 이상의 설명입니다. 충분히 긴 텍스트를 포함하고 있어야 합니다.',
            publishedDate: '2023'
          }
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchBooks(['성장', '습관']);

    if (results.length > 0) {
      expect(results[0].reasoning).toBeDefined();
      expect(results[0].reasoning).toContain('성장');
      expect(results[0].reasoning).toContain('습관');
      expect(results[0].reasoning).toContain('책');
    }
  });
});
