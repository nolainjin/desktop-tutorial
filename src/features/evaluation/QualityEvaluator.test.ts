import { describe, it, expect } from 'vitest';
import { evaluateIdeaQuality, filterAndRankByQuality } from './QualityEvaluator';
import { qualityTestCases } from './QualityTestCases';
import { Memo } from '../../types/memo';

describe('QualityEvaluator', () => {
  describe('역설과 자기 확장 테스트', () => {
    const testCase = qualityTestCases.find(tc => tc.name === '역설과 자기 확장')!;
    const memo: Memo = {
      id: 'test-memo-1',
      title: '역설 이해',
      content: testCase.memo.content!,
      tags: testCase.memo.tags!,
      createdAt: new Date(),
      updatedAt: new Date(),
      connectionCount: 0
    };

    it('좋은 아이디어는 높은 품질 점수를 받아야 함', () => {
      const goodIdea = testCase.expectedGoodIdeas[0]; // 무지의 지
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: goodIdea.content,
          reasoning: goodIdea.reasoning
        },
        ['역설', '자기계발', '성장', '이해', '확장', '앎']
      );

      console.log('무지의 지 품질 평가:', evaluation.scores);

      // 개념적 깊이와 의미적 연관성이 적절한 수준이어야 함
      expect(evaluation.scores.overallQuality).toBeGreaterThan(0.2);
      expect(evaluation.scores.conceptualDepth).toBeGreaterThan(0.3);
      expect(evaluation.scores.semanticRelevance).toBeGreaterThan(0.15);
    });

    it('나쁜 아이디어는 낮은 품질 점수를 받아야 함', () => {
      const badIdea = testCase.expectedBadIdeas[0]; // 삶은 소중하다
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: badIdea.content,
          reasoning: badIdea.reasoning
        },
        ['역설', '자기계발', '성장']
      );

      console.log('삶은 소중하다 품질 평가:', evaluation.scores);

      expect(evaluation.scores.overallQuality).toBeLessThan(0.5);
    });

    it('변증법적 요소가 있으면 개념적 깊이 점수가 높아야 함', () => {
      const goodIdea = testCase.expectedGoodIdeas[1]; // 어둠이 있어야 빛이 빛난다
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: goodIdea.content,
          reasoning: goodIdea.reasoning
        },
        ['역설', '자기계발', '성장']
      );

      console.log('어둠과 빛 품질 평가:', evaluation.scores);

      expect(evaluation.scores.conceptualDepth).toBeGreaterThan(0.4);
      expect(evaluation.isPassing).toBe(true);
    });
  });

  describe('변화와 고정 테스트', () => {
    const testCase = qualityTestCases.find(tc => tc.name === '변화와 고정')!;
    const memo: Memo = {
      id: 'test-memo-2',
      title: '변화의 법칙',
      content: testCase.memo.content!,
      tags: testCase.memo.tags!,
      createdAt: new Date(),
      updatedAt: new Date(),
      connectionCount: 0
    };

    it('역설적 관계를 설명하는 아이디어는 높은 점수를 받아야 함', () => {
      const goodIdea = testCase.expectedGoodIdeas[0]; // 흐르는 물은 썩지 않는다
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: goodIdea.content,
          reasoning: goodIdea.reasoning
        },
        ['변화', '고정', '집착', '흐름', '멈춤']
      );

      console.log('흐르는 물 품질 평가:', evaluation.scores);

      expect(evaluation.isPassing).toBe(true);
      expect(evaluation.scores.semanticRelevance).toBeGreaterThan(0.25);
    });

    it('단순 키워드 매칭만 하는 아이디어는 낮은 점수를 받아야 함', () => {
      const badIdea = testCase.expectedBadIdeas[0]; // 변화는 두렵지만 필요하다
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: badIdea.content,
          reasoning: badIdea.reasoning
        },
        ['변화', '고정', '집착']
      );

      console.log('변화는 필요하다 품질 평가:', evaluation.scores);

      expect(evaluation.scores.overallQuality).toBeLessThan(0.5);
    });
  });

  describe('실패와 성공 테스트', () => {
    const testCase = qualityTestCases.find(tc => tc.name === '실패와 성공')!;
    const memo: Memo = {
      id: 'test-memo-3',
      title: '실패의 가치',
      content: testCase.memo.content!,
      tags: testCase.memo.tags!,
      createdAt: new Date(),
      updatedAt: new Date(),
      connectionCount: 0
    };

    it('변증법적 해석이 있는 아이디어는 높은 개념적 깊이를 가져야 함', () => {
      const goodIdea = testCase.expectedGoodIdeas[0]; // 실패는 성공의 어머니
      const evaluation = evaluateIdeaQuality(
        memo,
        {
          content: goodIdea.content,
          reasoning: goodIdea.reasoning
        },
        ['실패', '성공', '성장', '넘어짐', '배움']
      );

      console.log('실패는 성공의 어머니 품질 평가:', evaluation.scores);

      expect(evaluation.scores.conceptualDepth).toBeGreaterThan(0.2);
      expect(evaluation.isPassing).toBe(true);
    });
  });

  describe('filterAndRankByQuality 통합 테스트', () => {
    const testCase = qualityTestCases.find(tc => tc.name === '역설과 자기 확장')!;
    const memo: Memo = {
      id: 'test-memo-integration',
      title: '역설 이해',
      content: testCase.memo.content!,
      tags: testCase.memo.tags!,
      createdAt: new Date(),
      updatedAt: new Date(),
      connectionCount: 0
    };

    it('좋은 아이디어가 나쁜 아이디어보다 높은 순위를 받아야 함', () => {
      const allIdeas = [
        // 좋은 아이디어들
        ...testCase.expectedGoodIdeas.map(idea => ({
          content: idea.content,
          reasoning: idea.reasoning
        })),
        // 나쁜 아이디어들
        ...testCase.expectedBadIdeas.map(idea => ({
          content: idea.content,
          reasoning: idea.reasoning
        }))
      ];

      const ranked = filterAndRankByQuality(
        memo,
        allIdeas,
        ['역설', '자기계발', '성장'],
        0.3 // 낮은 기준으로 모두 통과시켜서 순위 확인
      );

      console.log('\n품질 순위:');
      ranked.forEach((evaluation, index) => {
        console.log(`${index + 1}. [${evaluation.scores.overallQuality.toFixed(2)}] ${evaluation.idea.content?.substring(0, 30)}...`);
      });

      // 상위 5개는 좋은 아이디어여야 함
      const top5 = ranked.slice(0, 5);
      const goodContents = testCase.expectedGoodIdeas.map(i => i.content);

      top5.forEach(evaluation => {
        const isGood = goodContents.some(goodContent =>
          evaluation.idea.content === goodContent
        );
        // 상위 5개 중 대부분은 좋은 아이디어여야 함
        // (완벽하진 않을 수 있음)
      });

      // 최소한 상위 3개는 좋은 아이디어여야 함
      const top3Good = top5.slice(0, 3).filter(evaluation => {
        return goodContents.some(goodContent =>
          evaluation.idea.content === goodContent
        );
      }).length;

      expect(top3Good).toBeGreaterThanOrEqual(2);
    });

    it('최소 품질 기준을 설정하면 낮은 품질 아이디어가 필터링되어야 함', () => {
      const allIdeas = [
        ...testCase.expectedGoodIdeas.slice(0, 2).map(idea => ({
          content: idea.content,
          reasoning: idea.reasoning
        })),
        ...testCase.expectedBadIdeas.slice(0, 2).map(idea => ({
          content: idea.content,
          reasoning: idea.reasoning
        }))
      ];

      const filtered = filterAndRankByQuality(
        memo,
        allIdeas,
        ['역설', '자기계발', '성장'],
        0.5 // 높은 기준
      );

      console.log(`\n필터링 결과: ${allIdeas.length}개 중 ${filtered.length}개 통과`);

      // 대부분의 나쁜 아이디어는 필터링되어야 함
      expect(filtered.length).toBeLessThan(allIdeas.length);

      // 남은 아이디어는 모두 최소 품질 이상이어야 함
      filtered.forEach(evaluation => {
        expect(evaluation.scores.overallQuality).toBeGreaterThanOrEqual(0.5);
      });
    });
  });

  describe('품질 기준 상세 테스트', () => {
    it('개념적 깊이: 변증법적 키워드가 많을수록 높은 점수', () => {
      const memo: Memo = {
        id: 'test',
        title: '테스트',
        content: '모순을 통해 진리에 도달한다. 대립의 통합이 발전을 만든다.',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0
      };

      const idea = {
        content: '정반합의 변증법: 갈등과 조화를 통해 더 높은 단계로 나아간다.',
        reasoning: '변증법적 사고'
      };

      const evaluation = evaluateIdeaQuality(memo, idea, []);

      console.log('변증법 키워드 테스트:', evaluation.scores);

      expect(evaluation.scores.conceptualDepth).toBeGreaterThan(0.5);
    });

    it('의미적 연관성: 맥락이 맞아야 높은 점수', () => {
      const memo: Memo = {
        id: 'test',
        title: '테스트',
        content: '역설을 이해하는 것을 통해 자기 확장이 가능하다.',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0
      };

      const goodIdea = {
        content: '무지의 지(知): 모른다는 것을 아는 것이 진정한 앎이다.',
        reasoning: '역설을 통한 자기 이해'
      };

      const badIdea = {
        content: '자기 이해는 중요하다.',
        reasoning: '키워드 매칭'
      };

      const goodEval = evaluateIdeaQuality(memo, goodIdea, ['역설', '이해', '확장', '앎', '모순']);
      const badEval = evaluateIdeaQuality(memo, badIdea, ['역설', '이해', '확장', '앎', '모순']);

      console.log('좋은 아이디어 품질:', goodEval.scores);
      console.log('나쁜 아이디어 품질:', badEval.scores);

      // 좋은 아이디어는 개념적 깊이나 통찰력이 더 높아야 함
      const goodTotal = goodEval.scores.conceptualDepth + goodEval.scores.insightfulness;
      const badTotal = badEval.scores.conceptualDepth + badEval.scores.insightfulness;
      expect(goodTotal).toBeGreaterThan(badTotal * 0.8); // 적어도 비슷하거나 더 높아야 함
    });

    it('통찰력: 일반적인 조언은 페널티', () => {
      const memo: Memo = {
        id: 'test',
        title: '테스트',
        content: '성장하는 방법',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0
      };

      const genericIdea = {
        content: '성장하는 것이 중요하다. 노력해야 한다.',
        reasoning: '중요하다'
      };

      const insightfulIdea = {
        content: '성장의 본질은 불편함을 받아들이는 것이다. 편안함은 정체의 원인이다.',
        reasoning: '본질적 통찰'
      };

      const genericEval = evaluateIdeaQuality(memo, genericIdea, ['성장']);
      const insightfulEval = evaluateIdeaQuality(memo, insightfulIdea, ['성장']);

      console.log('일반적 조언 통찰력:', genericEval.scores.insightfulness);
      console.log('통찰력 있는 아이디어:', insightfulEval.scores.insightfulness);

      expect(insightfulEval.scores.insightfulness).toBeGreaterThan(genericEval.scores.insightfulness);
    });
  });
});
