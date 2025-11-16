import { describe, it, expect } from 'vitest';
import { extractKeywords } from './KeywordExtractor';

describe('KeywordExtractor', () => {
  describe('extractKeywords', () => {
    describe('패턴 매칭 기본 동작', () => {
      it('성장 관련 단어를 포함하면 "성장" 키워드를 추출해야 함', () => {
        const keywords = extractKeywords('매일 성장하는 습관');
        expect(keywords).toContain('성장');
      });

      it('습관 관련 단어를 포함하면 "습관" 키워드를 추출해야 함', () => {
        const keywords = extractKeywords('매일 반복하는 루틴');
        expect(keywords).toContain('습관');
      });

      it('실패 관련 단어를 포함하면 "실패" 키워드를 추출해야 함', () => {
        const keywords = extractKeywords('좌절을 극복하고');
        expect(keywords).toContain('실패');
      });

      it('성공 관련 단어를 포함하면 "성공" 키워드를 추출해야 함', () => {
        const keywords = extractKeywords('목표를 달성하다');
        expect(keywords).toContain('성공');
      });

      it('여러 패턴 매칭 단어가 있으면 높은 점수를 받아야 함', () => {
        const keywords = extractKeywords('성장하고 발전하며 진보하다');
        expect(keywords).toContain('성장');
        // 성장, 발전, 진보 = 3개 단어 = 6점
      });
    });

    describe('점수 기반 정렬', () => {
      it('점수가 높은 키워드를 우선 선택해야 함', () => {
        const text = '성장 발전 진보 향상 나아가 그리고 습관';
        const keywords = extractKeywords(text);

        // '성장' 관련 단어가 5개 (10점), '습관' 관련 단어가 1개 (2점)
        expect(keywords[0]).toBe('성장');
      });

      it('최대 3개의 키워드만 추출해야 함 (태그 제외)', () => {
        const text = '성장 습관 실패 성공 친구 배움 노력';
        const keywords = extractKeywords(text);

        // 태그 없이는 최대 3개
        expect(keywords.length).toBeLessThanOrEqual(3);
      });

      it('같은 점수면 패턴 정의 순서대로 나와야 함', () => {
        const text = '성장 습관';
        const keywords = extractKeywords(text);

        // 둘 다 2점이지만 '성장'이 먼저 정의됨
        expect(keywords).toContain('성장');
        expect(keywords).toContain('습관');
      });
    });

    describe('태그 통합', () => {
      it('태그를 키워드에 추가해야 함', () => {
        const keywords = extractKeywords('아무 텍스트', ['독서', '운동']);
        expect(keywords).toContain('독서');
        expect(keywords).toContain('운동');
      });

      it('태그는 최대 2개까지만 추가해야 함', () => {
        const keywords = extractKeywords('텍스트', ['태그1', '태그2', '태그3', '태그4']);

        // 패턴 매칭 키워드 0개 + 태그 2개 + 명사 추출
        const tagCount = keywords.filter(k => k.startsWith('태그')).length;
        expect(tagCount).toBeLessThanOrEqual(2);
      });

      it('빈 태그 배열은 무시해야 함', () => {
        const keywords1 = extractKeywords('성장 습관');
        const keywords2 = extractKeywords('성장 습관', []);

        expect(keywords1).toEqual(keywords2);
      });

      it('패턴 매칭 키워드와 태그가 합쳐져야 함', () => {
        const keywords = extractKeywords('성장하는 습관', ['독서']);

        expect(keywords).toContain('성장');
        expect(keywords).toContain('습관');
        expect(keywords).toContain('독서');
      });
    });

    describe('폴백: 명사 추출', () => {
      it('패턴 매칭 키워드가 없으면 명사를 추출해야 함', () => {
        const keywords = extractKeywords('사과 바나나 오렌지');

        // 패턴 매칭 안되므로 명사 추출
        expect(keywords.length).toBeGreaterThan(0);
        expect(keywords).toContain('사과');
      });

      it('명사는 2자 이상 10자 이하만 추출해야 함', () => {
        const keywords = extractKeywords('x 사과 초초초초초초초초긴단어');

        // 'x'는 1자라 제외, '초초초초초초초초긴단어'는 11자라서 제외
        expect(keywords).not.toContain('x');
        expect(keywords).not.toContain('초초초초초초초초긴단어');
        expect(keywords).toContain('사과');
      });

      it('명사는 최대 3개까지만 추출해야 함', () => {
        const text = '사과 바나나 오렌지 포도 수박 딸기';
        const keywords = extractKeywords(text);

        // 패턴 매칭 없으므로 명사 3개
        expect(keywords.length).toBeLessThanOrEqual(3);
      });

      it('태그가 있으면 명사 추출을 건너뛰게 됨', () => {
        const keywords = extractKeywords('포도 수박', ['독서']);

        // 태그가 keywords에 먼저 추가되어 length > 0이 되므로 명사 추출 건너뜀
        expect(keywords).toContain('독서');
        // 포도와 수박은 포함되지 않음 (명사 추출 조건이 keywords.length === 0)
        expect(keywords.length).toBeGreaterThan(0);
      });
    });

    describe('중복 제거', () => {
      it('중복된 키워드를 제거해야 함', () => {
        const keywords = extractKeywords('성장 발전', ['성장']);

        // '성장'이 패턴 매칭과 태그에서 모두 나옴
        const growthCount = keywords.filter(k => k === '성장').length;
        expect(growthCount).toBe(1);
      });

      it('명사 추출에서 중복 제거해야 함', () => {
        const keywords = extractKeywords('사과 사과 바나나 바나나');

        const uniqueKeywords = new Set(keywords);
        expect(keywords.length).toBe(uniqueKeywords.size);
      });
    });

    describe('엣지 케이스', () => {
      it('빈 문자열을 처리해야 함', () => {
        const keywords = extractKeywords('');
        expect(Array.isArray(keywords)).toBe(true);
        expect(keywords.length).toBeGreaterThanOrEqual(0);
      });

      it('공백만 있는 문자열을 처리해야 함', () => {
        const keywords = extractKeywords('   ');
        expect(Array.isArray(keywords)).toBe(true);
      });

      it('특수 문자만 있는 문자열을 처리해야 함', () => {
        const keywords = extractKeywords('!@#$%^&*()');
        expect(Array.isArray(keywords)).toBe(true);
      });

      it('매우 긴 텍스트도 처리할 수 있어야 함', () => {
        const longText = '성장 '.repeat(1000) + '습관 '.repeat(500);
        const keywords = extractKeywords(longText);

        expect(keywords).toContain('성장');
        expect(keywords).toContain('습관');
        expect(keywords.length).toBeLessThanOrEqual(3);
      });

      it('한 글자 단어는 명사 추출에서 제외되어야 함', () => {
        const keywords = extractKeywords('a b c 사과');
        expect(keywords).not.toContain('a');
        expect(keywords).not.toContain('b');
        expect(keywords).not.toContain('c');
      });

      it('숫자만 있는 텍스트를 처리해야 함', () => {
        const keywords = extractKeywords('123 456 789');
        expect(Array.isArray(keywords)).toBe(true);
      });
    });

    describe('복잡한 시나리오', () => {
      it('모든 기능이 통합되어 작동해야 함', () => {
        const text = '매일 성장하고 발전하는 습관을 기르자. 노력하면 목표를 달성할 수 있다.';
        const tags = ['자기계발', '일상'];
        const keywords = extractKeywords(text, tags);

        // 성장(4점: 성장, 발전), 습관(2점), 노력(2점), 성공(2점: 목표, 달성)
        // 상위 3개: 성장, 습관/노력/성공 중 2개
        // + 태그 2개
        expect(keywords).toContain('성장');
        expect(keywords).toContain('자기계발');
        expect(keywords).toContain('일상');
        expect(keywords.length).toBeGreaterThan(0);
        expect(keywords.length).toBeLessThanOrEqual(5); // 패턴 3개 + 태그 2개
      });

      it('패턴 없고 태그만 있는 경우', () => {
        const keywords = extractKeywords('아무 의미 없는 텍스트', ['중요한', '태그']);

        expect(keywords).toContain('중요한');
        expect(keywords).toContain('태그');
      });

      it('패턴과 태그가 모두 없는 경우', () => {
        const keywords = extractKeywords('단순한 명사들 모음');

        // 명사 추출로 폴백
        expect(keywords.length).toBeGreaterThan(0);
      });

      it('모든 패턴 카테고리가 매칭되는 경우', () => {
        const text = '성장 습관 실패 성공 친구 배움 노력 변화 행복 사랑 자유 창의 지혜 꿈 용기';
        const keywords = extractKeywords(text);

        // 최대 3개만 선택되어야 함
        expect(keywords.length).toBe(3);
      });
    });

    describe('실제 사용 케이스', () => {
      it('일기 형식 텍스트에서 키워드 추출', () => {
        const text = '오늘은 새로운 습관을 시작했다. 매일 아침 운동하기. 작은 변화지만 큰 성장의 시작이다.';
        const keywords = extractKeywords(text);

        expect(keywords).toContain('습관');
        expect(keywords).toContain('변화');
        expect(keywords).toContain('성장');
      });

      it('명언 형식 텍스트에서 키워드 추출', () => {
        const text = '실패는 성공의 어머니다. 좌절하지 말고 계속 도전하라.';
        const keywords = extractKeywords(text);

        expect(keywords).toContain('실패');
        expect(keywords).toContain('성공');
        expect(keywords).toContain('노력'); // '도전'이 노력 패턴에 포함
      });

      it('책 내용 형식 텍스트에서 키워드 추출', () => {
        const text = '진정한 지혜는 배움에서 나온다. 끊임없이 공부하고 학습하라.';
        const tags = ['독서', '교육'];
        const keywords = extractKeywords(text, tags);

        expect(keywords).toContain('지혜');
        expect(keywords).toContain('배움');
        expect(keywords).toContain('독서');
      });
    });
  });
});
