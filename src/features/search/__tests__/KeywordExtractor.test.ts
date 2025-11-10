import { describe, it, expect } from 'vitest';
import { extractKeywords } from '../KeywordExtractor';

describe('KeywordExtractor', () => {
  describe('extractKeywords', () => {
    it('텍스트에서 주요 키워드를 추출해야 함', () => {
      const text = '성장은 매일의 습관에서 나온다. 꾸준한 노력이 중요하다.';
      const keywords = extractKeywords(text);

      expect(keywords).toContain('성장');
      expect(keywords).toContain('습관');
      expect(keywords).toContain('노력');
    });

    it('가장 관련성 높은 키워드를 먼저 반환해야 함', () => {
      const text = '배움 배움 배우는 것은 중요하다. 학습하고 공부하자.';
      const keywords = extractKeywords(text);

      // '배움' 관련 키워드가 많으므로 먼저 나와야 함
      expect(keywords[0]).toBe('배움');
    });

    it('태그를 키워드에 포함해야 함', () => {
      const text = '일상의 작은 변화';
      const tags = ['변화', '일상'];
      const keywords = extractKeywords(text, tags);

      expect(keywords).toContain('변화');
    });

    it('중복된 키워드를 제거해야 함', () => {
      const text = '성장 성장 성장하는 것이 중요하다';
      const keywords = extractKeywords(text);

      const uniqueKeywords = new Set(keywords);
      expect(keywords.length).toBe(uniqueKeywords.size);
    });

    it('빈 텍스트는 빈 배열 또는 태그만 반환해야 함', () => {
      const keywords = extractKeywords('');
      expect(Array.isArray(keywords)).toBe(true);
    });

    it('키워드가 없는 텍스트는 주요 명사를 추출해야 함', () => {
      const text = '오늘은 날씨가 좋습니다';
      const keywords = extractKeywords(text);

      expect(keywords.length).toBeGreaterThan(0);
    });

    it('여러 카테고리의 키워드를 균형있게 추출해야 함', () => {
      const text = '성공을 위해서는 습관적인 노력과 배움이 필요하다';
      const keywords = extractKeywords(text);

      // 최소 2개 이상의 서로 다른 키워드
      expect(keywords.length).toBeGreaterThanOrEqual(2);
    });

    it('최대 키워드 수를 초과하지 않아야 함', () => {
      const text = '성장 습관 노력 배움 성공 실패 친구 변화 행복 사랑 자유 창의 지혜';
      const keywords = extractKeywords(text);

      // 기본적으로 상위 3개 + 태그 일부
      expect(keywords.length).toBeLessThanOrEqual(10);
    });

    it('특정 패턴의 변형 단어들을 매칭해야 함', () => {
      const text = '꾸준히 반복하는 루틴이 습관을 만든다';
      const keywords = extractKeywords(text);

      expect(keywords).toContain('습관');
    });
  });
});
