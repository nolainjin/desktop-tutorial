/**
 * 아이디어 연결 품질 평가 시스템
 *
 * 목표: 단순 키워드 매칭을 넘어 개념적/의미적 연관성 평가
 */

import { Idea } from '../../types/idea';
import { Memo } from '../../types/memo';

/**
 * 품질 평가 기준
 */
export interface QualityCriteria {
  // 1. 개념적 깊이 (0-1)
  conceptualDepth: number;

  // 2. 의미적 연관성 (0-1)
  semanticRelevance: number;

  // 3. 통찰력 (0-1)
  insightfulness: number;

  // 4. 전체 품질 점수 (0-1)
  overallQuality: number;
}

/**
 * 품질 평가 결과
 */
export interface QualityEvaluation {
  idea: Partial<Idea>;
  scores: QualityCriteria;
  reasoning: string;
  isPassing: boolean; // 최소 기준 통과 여부
}

/**
 * 개념적 패턴 정의
 * 높은 품질의 연결을 위한 개념 클러스터
 */
const CONCEPTUAL_PATTERNS = {
  // 변증법적 개념
  dialectical: {
    keywords: ['모순', '대립', '통합', '합', '정반합', '갈등', '조화', '양면', '대비', '상반'],
    relatedConcepts: ['역설', '이율배반', '딜레마', '양가감정', '반대', '반전', '뒤집']
  },

  // 역설적 개념
  paradoxical: {
    keywords: ['역설', '반대', '뒤집', '반전', '아이러니', '모순', '거꾸로', '반면'],
    relatedConcepts: ['예상밖', '의외', '놀라움', '전환', '오히려', '도리어']
  },

  // 확장/성장 개념
  expansion: {
    keywords: ['확장', '성장', '발전', '넓어', '커지', '진화', '발달', '나아', '도약'],
    relatedConcepts: ['변화', '전환', '성숙', '깨달음', '앞으로', '높아', '자기계발']
  },

  // 이해/통찰 개념
  understanding: {
    keywords: ['이해', '깨달', '통찰', '인식', '자각', '지혜', '앎', '알', '알다', '깨닫', '배우'],
    relatedConcepts: ['배움', '학습', '경험', '성찰', '사고', '생각', '이치', '터득']
  },

  // 심층적 사고
  deepThinking: {
    keywords: ['본질', '근본', '심층', '깊이', '원리', '진리', '철학', '의미', '가치'],
    relatedConcepts: ['사색', '성찰', '명상', '숙고', '탐구', '본래', '참된']
  },

  // 변화와 흐름
  change: {
    keywords: ['변화', '바뀌', '달라', '변하', '움직', '흐름', '흐르', '멈춤', '정체'],
    relatedConcepts: ['유동', '고정', '고착', '정지', '멈추', '계속', '지속']
  },

  // 실패와 성공
  failureSuccess: {
    keywords: ['실패', '성공', '넘어', '일어', '포기', '도전', '실수', '잘못'],
    relatedConcepts: ['좌절', '극복', '재도전', '시행착오', '경험', '배움']
  }
};

/**
 * 피해야 할 얕은 수준의 매칭 패턴
 */
const SHALLOW_PATTERNS = {
  // 단순 단어 반복
  wordRepetition: ['단순히 같은 단어 포함', '키워드만 일치'],

  // 피상적 연관
  superficial: ['일반적인 조언', '뻔한 내용', '상투적 표현'],

  // 맥락 무시
  contextIgnoring: ['전혀 다른 맥락', '관계없는 주제']
};

/**
 * 개념적 깊이 평가
 * 변증법적 요소, 역설적 사고, 심층적 통찰이 있는지 평가
 */
function evaluateConceptualDepth(memoContent: string, ideaContent: string): number {
  let score = 0;
  const memo = memoContent.toLowerCase();
  const idea = ideaContent.toLowerCase();

  // 1. 변증법적 요소 (0.4점)
  const dialecticalWords = [...CONCEPTUAL_PATTERNS.dialectical.keywords, ...CONCEPTUAL_PATTERNS.dialectical.relatedConcepts];
  const memoHasDialectical = dialecticalWords.some(w => memo.includes(w));
  const ideaHasDialectical = dialecticalWords.some(w => idea.includes(w));

  if (memoHasDialectical && ideaHasDialectical) {
    score += 0.4;
  } else if (memoHasDialectical || ideaHasDialectical) {
    score += 0.2;
  }

  // 2. 역설적 사고 (0.4점) - 메모가 역설 주제면 아이디어도 역설적이어야 함
  const paradoxicalWords = [...CONCEPTUAL_PATTERNS.paradoxical.keywords, ...CONCEPTUAL_PATTERNS.paradoxical.relatedConcepts];
  const memoHasParadox = paradoxicalWords.some(w => memo.includes(w));
  const ideaHasParadox = paradoxicalWords.some(w => idea.includes(w));

  if (memoHasParadox && ideaHasParadox) {
    score += 0.4;
  } else if (memoHasParadox || ideaHasParadox) {
    score += 0.15;
  }

  // 3. 심층적 사고 (0.2점)
  const deepWords = CONCEPTUAL_PATTERNS.deepThinking.keywords;
  const ideaHasDeep = deepWords.some(w => idea.includes(w));

  if (ideaHasDeep) {
    score += 0.2;
  }

  return Math.min(score, 1.0);
}

/**
 * 의미적 연관성 평가
 * 맥락적으로 연결되는지 평가 (단순 키워드 매칭이 아닌)
 */
function evaluateSemanticRelevance(
  memoContent: string,
  ideaContent: string,
  memoKeywords: string[]
): number {
  let score = 0;
  const memo = memoContent.toLowerCase();
  const idea = ideaContent.toLowerCase();

  // 1. 개념 클러스터 매칭 (0.6점)
  let conceptMatches = 0;
  let totalPatterns = 0;

  for (const [_, pattern] of Object.entries(CONCEPTUAL_PATTERNS)) {
    const memoHasPattern = pattern.keywords.some(k => memo.includes(k)) ||
                          pattern.relatedConcepts.some(k => memo.includes(k));
    const ideaHasPattern = pattern.keywords.some(k => idea.includes(k)) ||
                           pattern.relatedConcepts.some(k => idea.includes(k));

    if (memoHasPattern && ideaHasPattern) {
      conceptMatches++;
    }
    if (memoHasPattern) totalPatterns++;
  }

  // 메모가 가진 개념 패턴 중 몇 개나 아이디어와 공유하는가?
  if (totalPatterns > 0) {
    score += (conceptMatches / totalPatterns) * 0.6;
  }

  // 2. 키워드 연관성 (0.4점)
  // 메모의 주요 키워드가 아이디어에 포함되어 있는가?
  const keywordMatches = memoKeywords.filter(k => idea.includes(k.toLowerCase())).length;
  if (memoKeywords.length > 0) {
    score += Math.min((keywordMatches / memoKeywords.length) * 0.4, 0.4);
  }

  return Math.max(0, Math.min(score, 1.0));
}

/**
 * 통찰력 평가
 * 새로운 관점, 깊은 이해를 제공하는지 평가
 */
function evaluateInsightfulness(ideaContent: string, reasoning: string): number {
  let score = 0;
  const idea = ideaContent.toLowerCase();
  const reason = reasoning.toLowerCase();

  // 1. 다각적 관점 제시 (0.4점)
  const perspectiveWords = ['관점', '시각', '각도', '측면', '면', '입장'];
  if (perspectiveWords.some(w => idea.includes(w) || reason.includes(w))) {
    score += 0.4;
  }

  // 2. 인과관계 설명 (0.3점)
  const causalWords = ['때문', '결과', '원인', '이유', '영향', '결과'];
  if (causalWords.some(w => idea.includes(w) || reason.includes(w))) {
    score += 0.3;
  }

  // 3. 추상적 사고 (0.3점)
  const abstractWords = ['본질', '원리', '법칙', '진리', '의미', '가치'];
  if (abstractWords.some(w => idea.includes(w))) {
    score += 0.3;
  }

  // 페널티: 너무 일반적인 조언 (-0.4점)
  const genericPhrases = ['중요하다', '필요하다', '해야 한다', '하자'];
  const genericCount = genericPhrases.filter(p => idea.includes(p)).length;
  if (genericCount >= 1) {
    score -= 0.4;
  }

  return Math.max(0, Math.min(score, 1.0));
}

/**
 * 전체 품질 평가
 */
export function evaluateIdeaQuality(
  memo: Memo,
  idea: Partial<Idea>,
  memoKeywords: string[]
): QualityEvaluation {
  const conceptualDepth = evaluateConceptualDepth(memo.content, idea.content || '');
  const semanticRelevance = evaluateSemanticRelevance(
    memo.content,
    idea.content || '',
    memoKeywords
  );
  const insightfulness = evaluateInsightfulness(
    idea.content || '',
    idea.reasoning || ''
  );

  // 가중 평균으로 전체 품질 계산
  const overallQuality =
    conceptualDepth * 0.40 +      // 개념적 깊이 40%
    semanticRelevance * 0.45 +    // 의미적 연관성 45%
    insightfulness * 0.15;        // 통찰력 15%

  // 최소 기준: 전체 품질 0.25 이상 + 의미적 연관성 0.18 이상
  const isPassing = overallQuality >= 0.25 && semanticRelevance >= 0.18;

  // 품질에 따른 reasoning 생성
  let qualityReasoning = '';
  if (overallQuality >= 0.6) {
    qualityReasoning = '높은 품질: 개념적으로 깊이 있고 의미적으로 연관성이 높습니다.';
  } else if (overallQuality >= 0.4) {
    qualityReasoning = '중간 품질: 어느 정도 연관성이 있지만 더 깊은 통찰이 필요합니다.';
  } else {
    qualityReasoning = '낮은 품질: 단순 키워드 매칭 수준이거나 맥락이 맞지 않습니다.';
  }

  return {
    idea,
    scores: {
      conceptualDepth,
      semanticRelevance,
      insightfulness,
      overallQuality
    },
    reasoning: qualityReasoning,
    isPassing
  };
}

/**
 * 여러 아이디어를 품질 순으로 정렬하고 필터링
 */
export function filterAndRankByQuality(
  memo: Memo,
  ideas: Partial<Idea>[],
  memoKeywords: string[],
  minQuality: number = 0.25
): QualityEvaluation[] {
  const evaluations = ideas.map(idea =>
    evaluateIdeaQuality(memo, idea, memoKeywords)
  );

  return evaluations
    .filter(evaluation => evaluation.scores.overallQuality >= minQuality)
    .sort((a, b) => b.scores.overallQuality - a.scores.overallQuality);
}
