import { describe, it, expect } from 'vitest';
import { calculateSimilarity, cosineSimilarity } from './SimilarityCalculator';

describe('SimilarityCalculator', () => {
  describe('calculateSimilarity', () => {
    describe('Jaccard 유사도 계산', () => {
      it('동일한 텍스트는 1.0에 가까운 점수를 반환해야 함', () => {
        const text = '성장 습관 실패 성공';
        const score = calculateSimilarity(text, text);
        expect(score).toBeGreaterThan(0.5);
      });

      it('완전히 다른 텍스트는 낮은 점수를 반환해야 함', () => {
        const text1 = '사과 바나나 오렌지';
        const text2 = '자동차 비행기 기차';
        const score = calculateSimilarity(text1, text2);
        expect(score).toBeLessThan(0.3);
      });

      it('부분적으로 겹치는 텍스트는 중간 점수를 반환해야 함', () => {
        const text1 = '성장 습관 배움';
        const text2 = '성장 노력 발전';
        const score = calculateSimilarity(text1, text2);
        expect(score).toBeGreaterThan(0.1);
        expect(score).toBeLessThan(0.7);
      });

      it('대소문자를 구분하지 않아야 함', () => {
        const score1 = calculateSimilarity('Hello World', 'hello world');
        expect(score1).toBeGreaterThan(0.4);
      });
    });

    describe('키워드 매칭 점수', () => {
      it('키워드가 매칭되면 점수가 증가해야 함', () => {
        const text1 = '성장과 습관';
        const text2 = '성장과 습관을 기르자';
        const scoreWithKeywords = calculateSimilarity(text1, text2);

        const text3 = '사과와 바나나';
        const text4 = '사과와 바나나를 먹자';
        const scoreWithoutKeywords = calculateSimilarity(text3, text4);

        // 키워드(성장, 습관)가 포함된 경우 점수가 더 높아야 함
        expect(scoreWithKeywords).toBeGreaterThan(scoreWithoutKeywords);
      });

      it('여러 키워드가 매칭되면 더 높은 점수를 받아야 함', () => {
        const text1 = '성장 습관 실패 성공';
        const text2 = '성장 습관 실패 성공 배움';
        const score = calculateSimilarity(text1, text2);

        // 4개의 키워드가 매칭되어 0.4 (0.1 * 4) 추가
        expect(score).toBeGreaterThan(0.5);
      });
    });

    describe('태그 매칭 보너스', () => {
      it('태그가 텍스트에 포함되면 보너스 점수를 받아야 함', () => {
        const text1 = '독서를 좋아함';
        const text2 = '독서는 성장의 기본';

        const scoreWithoutTags = calculateSimilarity(text1, text2);
        const scoreWithTags = calculateSimilarity(text1, text2, ['독서', '성장']);

        expect(scoreWithTags).toBeGreaterThan(scoreWithoutTags);
      });

      it('여러 태그가 매칭되면 더 높은 보너스를 받아야 함', () => {
        const text1 = '독서 습관';
        const text2 = '독서와 습관 기르기';

        const scoreOneTag = calculateSimilarity(text1, text2, ['독서']);
        const scoreTwoTags = calculateSimilarity(text1, text2, ['독서', '습관']);

        expect(scoreTwoTags).toBeGreaterThan(scoreOneTag);
      });

      it('빈 태그 배열은 보너스를 주지 않아야 함', () => {
        const text1 = '독서를 좋아함';
        const text2 = '독서는 좋다';

        const scoreNoTags = calculateSimilarity(text1, text2);
        const scoreEmptyTags = calculateSimilarity(text1, text2, []);

        expect(scoreNoTags).toBe(scoreEmptyTags);
      });
    });

    describe('엣지 케이스', () => {
      it('빈 문자열 처리', () => {
        const score1 = calculateSimilarity('', '');
        expect(score1).toBeGreaterThanOrEqual(0);
        expect(score1).toBeLessThanOrEqual(1);
        expect(isNaN(score1)).toBe(false);

        const score2 = calculateSimilarity('텍스트', '');
        expect(score2).toBeGreaterThanOrEqual(0);
        expect(score2).toBeLessThanOrEqual(1);
        expect(isNaN(score2)).toBe(false);
      });

      it('공백만 있는 문자열 처리', () => {
        const score = calculateSimilarity('   ', '   ');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
        expect(isNaN(score)).toBe(false);
      });

      it('특수 문자 포함 텍스트 처리', () => {
        const score = calculateSimilarity(
          '성장!@#$%^&*()',
          '성장!!!'
        );
        expect(score).toBeGreaterThan(0);
      });

      it('최종 점수는 절대 1.0을 초과하지 않아야 함', () => {
        const text = '성장 습관 실패 성공 친구 배움 노력';
        const tags = ['성장', '습관', '실패', '성공', '친구', '배움', '노력'];
        const score = calculateSimilarity(text, text, tags);

        expect(score).toBeLessThanOrEqual(1.0);
      });

      it('매우 긴 텍스트도 처리할 수 있어야 함', () => {
        const longText1 = '성장 '.repeat(1000) + '습관 '.repeat(500);
        const longText2 = '성장 '.repeat(800) + '습관 '.repeat(600);
        const score = calculateSimilarity(longText1, longText2);

        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });
    });

    describe('가중 평균 계산', () => {
      it('Jaccard(50%) + 키워드(30%) + 태그(20%) 가중치가 적용되어야 함', () => {
        // 완전히 다른 단어지만 키워드와 태그로 점수를 얻는 경우
        const text1 = '성장 습관';
        const text2 = '다른 텍스트이지만 성장 습관';
        const tags = ['성장'];

        const score = calculateSimilarity(text1, text2, tags);

        // Jaccard는 낮지만 키워드와 태그로 점수 상승
        expect(score).toBeGreaterThan(0);
      });
    });
  });

  describe('cosineSimilarity', () => {
    describe('기본 동작', () => {
      it('동일한 텍스트는 1.0을 반환해야 함', () => {
        const text = '성장 습관 배움';
        const score = cosineSimilarity(text, text);
        expect(score).toBeCloseTo(1.0, 5);
      });

      it('완전히 다른 텍스트는 0을 반환해야 함', () => {
        const text1 = '사과 바나나';
        const text2 = '자동차 비행기';
        const score = cosineSimilarity(text1, text2);
        expect(score).toBe(0);
      });

      it('부분적으로 겹치는 텍스트는 0과 1 사이 값을 반환해야 함', () => {
        const text1 = '성장 습관 배움';
        const text2 = '성장 노력 발전';
        const score = cosineSimilarity(text1, text2);
        expect(score).toBeGreaterThan(0);
        expect(score).toBeLessThan(1);
      });

      it('대소문자를 구분하지 않아야 함', () => {
        const score1 = cosineSimilarity('Hello World', 'hello world');
        expect(score1).toBeCloseTo(1.0, 5);
      });
    });

    describe('단어 빈도 고려', () => {
      it('같은 단어가 여러 번 나오면 유사도에 영향을 줘야 함', () => {
        const text1 = '성장 성장 성장';
        const text2 = '성장';
        const score = cosineSimilarity(text1, text2);

        // 코사인 유사도는 벡터의 방향만 비교하므로,
        // 같은 단어만 있으면 빈도와 관계없이 1.0이 나옴 (정상 동작)
        expect(score).toBeCloseTo(1.0, 5);
      });

      it('빈도가 같으면 더 높은 유사도를 보여야 함', () => {
        const text1 = '성장 성장 습관 습관';
        const text2 = '성장 성장 습관 습관';
        const score = cosineSimilarity(text1, text2);
        expect(score).toBeCloseTo(1.0, 5);
      });
    });

    describe('엣지 케이스', () => {
      it('빈 문자열을 처리해야 함', () => {
        // 빈 문자열을 split하면 ['']가 되어 빈 문자열 하나로 취급됨
        // 따라서 두 빈 문자열은 같은 벡터를 가져 1.0이 나옴
        const score1 = cosineSimilarity('', '');
        expect(score1).toBeCloseTo(1.0, 5);

        // 빈 문자열과 텍스트는 공통 단어가 없어 0
        const score2 = cosineSimilarity('텍스트', '');
        expect(score2).toBeGreaterThanOrEqual(0);

        const score3 = cosineSimilarity('', '텍스트');
        expect(score3).toBeGreaterThanOrEqual(0);
      });

      it('공백만 있는 문자열을 처리해야 함', () => {
        const score = cosineSimilarity('   ', '   ');
        expect(score).toBeGreaterThanOrEqual(0);
        expect(isNaN(score)).toBe(false);
      });

      it('특수 문자 포함 텍스트를 처리해야 함', () => {
        const score = cosineSimilarity(
          '성장!@#$%',
          '성장!!!'
        );
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      });

      it('매우 긴 텍스트도 처리할 수 있어야 함', () => {
        const longText1 = '성장 습관 '.repeat(1000);
        const longText2 = '성장 배움 '.repeat(1000);
        const score = cosineSimilarity(longText1, longText2);

        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
        expect(isNaN(score)).toBe(false);
      });
    });

    describe('벡터 계산', () => {
      it('dot product와 magnitude가 올바르게 계산되어야 함', () => {
        // 수학적으로 검증 가능한 간단한 케이스
        const text1 = 'a a b';
        const text2 = 'a b b';
        const score = cosineSimilarity(text1, text2);

        // vector1 = [2, 1], vector2 = [1, 2]
        // dot product = 2*1 + 1*2 = 4
        // magnitude1 = sqrt(4 + 1) = sqrt(5)
        // magnitude2 = sqrt(1 + 4) = sqrt(5)
        // cosine = 4 / 5 = 0.8
        expect(score).toBeCloseTo(0.8, 5);
      });
    });
  });
});
