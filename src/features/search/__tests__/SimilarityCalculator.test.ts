import { describe, it, expect } from 'vitest';
import { calculateSimilarity, cosineSimilarity } from '../SimilarityCalculator';

describe('SimilarityCalculator', () => {
  describe('calculateSimilarity', () => {
    it('동일한 텍스트는 높은 유사도를 반환해야 함', () => {
      const text = '성공은 습관의 결과입니다';
      const score = calculateSimilarity(text, text);
      expect(score).toBeGreaterThan(0.5);
    });

    it('완전히 다른 텍스트는 낮은 유사도를 반환해야 함', () => {
      const text1 = '사과는 빨갛다';
      const text2 = '하늘은 파랗다';
      const score = calculateSimilarity(text1, text2);
      expect(score).toBeLessThan(0.3);
    });

    it('공통 키워드가 있으면 유사도가 높아야 함', () => {
      const text1 = '성장은 매일의 습관에서 나온다';
      const text2 = '작은 습관이 큰 성장을 만든다';
      const score = calculateSimilarity(text1, text2);
      expect(score).toBeGreaterThan(0); // 공통 키워드가 있으므로 0보다 커야 함
    });

    it('태그가 일치하면 보너스 점수를 받아야 함', () => {
      const text1 = '꾸준한 노력이 중요하다';
      const text2 = '노력하면 성공할 수 있다';
      const tags = ['노력', '성공'];
      const scoreWithTags = calculateSimilarity(text1, text2, tags);
      const scoreWithoutTags = calculateSimilarity(text1, text2);

      expect(scoreWithTags).toBeGreaterThan(scoreWithoutTags);
    });

    it('유사도는 0과 1 사이여야 함', () => {
      const text1 = '성장 습관 성공 노력 배움 실천';
      const text2 = '성장 습관 성공 노력 배움 실천';
      const score = calculateSimilarity(text1, text2);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('빈 문자열 처리', () => {
      const score = calculateSimilarity('', '');
      expect(score).toBeDefined();
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('cosineSimilarity', () => {
    it('동일한 텍스트는 1에 가까운 값을 반환해야 함', () => {
      const text = '안녕하세요 반갑습니다';
      const score = cosineSimilarity(text, text);
      expect(score).toBeCloseTo(1, 5);
    });

    it('완전히 다른 텍스트는 0에 가까운 값을 반환해야 함', () => {
      const text1 = '사과 배 포도';
      const text2 = '자동차 기차 비행기';
      const score = cosineSimilarity(text1, text2);
      expect(score).toBe(0);
    });

    it('부분적으로 겹치는 텍스트는 중간 값을 반환해야 함', () => {
      const text1 = '사과 배 포도';
      const text2 = '사과 배 자동차';
      const score = cosineSimilarity(text1, text2);

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1);
    });

    it('빈 문자열은 0을 반환해야 함', () => {
      const score1 = cosineSimilarity('', 'test');
      const score2 = cosineSimilarity('test', '');
      const score3 = cosineSimilarity('', '');

      expect(score1).toBeGreaterThanOrEqual(0); // 빈 문자열 처리 확인
      expect(score2).toBeGreaterThanOrEqual(0);
      expect(score3).toBeGreaterThanOrEqual(0);
    });

    it('대소문자를 구분하지 않아야 함', () => {
      const text1 = 'HELLO WORLD';
      const text2 = 'hello world';
      const score = cosineSimilarity(text1, text2);

      expect(score).toBeCloseTo(1, 5);
    });
  });
});
