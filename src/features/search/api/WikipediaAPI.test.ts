import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchWikipedia } from './WikipediaAPI';

describe('WikipediaAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('위키백과 검색 결과를 반환해야 함', async () => {
    const mockResponse = [
      '',
      ['성장 (생물학)', '성장통'],
      ['생물의 세포 분열과 크기 증가 과정입니다. 이는 자연적인 현상이다.', '성장기에 느끼는 통증을 말합니다.'],
      ['https://ko.wikipedia.org/wiki/성장', 'https://ko.wikipedia.org/wiki/성장통']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['성장', '발전']);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('academic');
    expect(results[0].source?.platform).toBe('Wikipedia');
    expect(results[0].content).toBeDefined();
  });

  it('30자 미만 설명은 필터링해야 함', async () => {
    const mockResponse = [
      '',
      ['짧은 설명', '긴 설명'],
      ['짧음', '이것은 매우 긴 설명입니다. 30자 이상의 텍스트를 포함하고 있습니다.'],
      ['url1', 'url2']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['test']);

    // 30자 이상인 것만 포함
    expect(results.every(r => r.content!.length >= 30)).toBe(true);
  });

  it('문장 형태가 아닌 것은 필터링해야 함', async () => {
    const mockResponse = [
      '',
      ['제목1', '제목2'],
      ['키워드 나열형 설명입니다만 문장이 아닙니다요', '올바른 문장입니다. 마침표가 있다.'],
      ['url1', 'url2']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['test']);

    // 마침표나 '다', '이다'로 끝나는 문장만
    expect(results.every(r => {
      const content = r.content!;
      return content.includes('.') || content.includes('다') || content.includes('이다');
    })).toBe(true);
  });

  it('최대 2개의 결과만 반환해야 함', async () => {
    const mockResponse = [
      '',
      ['제목1', '제목2', '제목3', '제목4', '제목5'],
      [
        '긴 설명입니다. 30자 이상이고 문장 형태입니다.',
        '또 다른 긴 설명입니다. 30자 이상이고 문장 형태입니다.',
        '세 번째 긴 설명입니다. 30자 이상이고 문장 형태입니다.',
        '네 번째 긴 설명입니다. 30자 이상이고 문장 형태입니다.',
        '다섯 번째 긴 설명입니다. 30자 이상이고 문장 형태입니다.'
      ],
      ['url1', 'url2', 'url3', 'url4', 'url5']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['test']);

    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('API 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    } as Response);

    const results = await searchWikipedia(['test']);

    expect(results).toEqual([]);
  });

  it('네트워크 오류 시 빈 배열을 반환해야 함', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const results = await searchWikipedia(['test']);

    expect(results).toEqual([]);
  });

  it('올바른 URL을 호출해야 함', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ['', [], [], []]
    } as Response);

    await searchWikipedia(['성장', '발전']);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('ko.wikipedia.org/w/api.php')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('action=opensearch')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=')
    );
  });

  it('유사도 점수를 설정해야 함', async () => {
    const mockResponse = [
      '',
      ['성장'],
      ['생물의 세포 분열과 크기 증가 과정입니다. 이는 자연적인 현상이다.'],
      ['https://ko.wikipedia.org/wiki/성장']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['성장']);

    if (results.length > 0) {
      expect(results[0].similarity).toBeGreaterThanOrEqual(0.7);
      expect(results[0].similarity).toBeLessThanOrEqual(0.85);
    }
  });

  it('reasoning 메시지를 포함해야 함', async () => {
    const mockResponse = [
      '',
      ['성장'],
      ['생물의 세포 분열과 크기 증가 과정입니다. 이는 자연적인 현상이다.'],
      ['https://ko.wikipedia.org/wiki/성장']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['성장', '발전']);

    if (results.length > 0) {
      expect(results[0].reasoning).toBeDefined();
      expect(results[0].reasoning).toContain('백과사전');
    }
  });

  it('source 정보를 올바르게 설정해야 함', async () => {
    const mockResponse = [
      '',
      ['성장 (생물학)'],
      ['생물의 세포 분열과 크기 증가 과정입니다. 이는 자연적인 현상이다.'],
      ['https://ko.wikipedia.org/wiki/성장']
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const results = await searchWikipedia(['성장']);

    if (results.length > 0) {
      const source = results[0].source!;
      expect(source.author).toBe('Wikipedia');
      expect(source.title).toBe('성장 (생물학)');
      expect(source.category).toBe('백과사전');
      expect(source.platform).toBe('Wikipedia');
      expect(source.url).toBe('https://ko.wikipedia.org/wiki/성장');
      expect(source.year).toBeDefined();
    }
  });
});
