/**
 * 품질 평가 시스템 테스트 케이스
 *
 * 좋은 연결 vs 나쁜 연결의 예시
 */

import { Memo } from '../../types/memo';
import { Idea } from '../../types/idea';

export interface TestCase {
  name: string;
  memo: Partial<Memo>;
  expectedGoodIdeas: Array<{
    content: string;
    reasoning: string;
    expectedQuality: 'high' | 'medium';
  }>;
  expectedBadIdeas: Array<{
    content: string;
    reasoning: string;
    whyBad: string;
  }>;
}

export const qualityTestCases: TestCase[] = [
  {
    name: '역설과 자기 확장',
    memo: {
      content: '삶의 역설을 이해하는 것은 나를 확장하는 방법이 된다.',
      tags: ['역설', '자기계발', '성장']
    },
    expectedGoodIdeas: [
      {
        content: '무지의 지(知): 내가 모른다는 것을 아는 것이 진정한 앎의 시작이다.',
        reasoning: '역설적 사고를 통한 자기 이해의 확장. 모순을 받아들임으로써 더 깊은 통찰에 도달한다.',
        expectedQuality: 'high'
      },
      {
        content: '어둠이 있어야 빛이 빛난다. 대립을 통해 본질을 이해한다.',
        reasoning: '변증법적 관점: 모순과 대립이 오히려 이해를 확장시킨다.',
        expectedQuality: 'high'
      },
      {
        content: '적을 알고 나를 알면 백전불태. 상반된 것을 모두 이해해야 완전하다.',
        reasoning: '대립적 요소의 통합을 통한 자기 확장',
        expectedQuality: 'high'
      },
      {
        content: '강함은 약함을 아는 데서 나온다.',
        reasoning: '역설적 통찰을 통한 자기 이해',
        expectedQuality: 'medium'
      },
      {
        content: '버림으로써 얻는다. 비움이 곧 채움이다.',
        reasoning: '역설적 행동을 통한 성장',
        expectedQuality: 'medium'
      }
    ],
    expectedBadIdeas: [
      {
        content: '삶은 소중하다. 매 순간을 감사하며 살자.',
        reasoning: '단순히 "삶" 키워드만 일치',
        whyBad: '역설이나 확장의 개념 없음. 일반적인 조언'
      },
      {
        content: '자기 이해가 중요하다. 나를 돌아보는 시간을 가지자.',
        reasoning: '단순히 "이해" 키워드만 일치',
        whyBad: '역설적 요소 없음. 표면적인 자기계발 조언'
      },
      {
        content: '성장하려면 노력해야 한다.',
        reasoning: '단순히 "성장" 키워드만 일치',
        whyBad: '뻔한 내용. 깊이 없음'
      },
      {
        content: '방법을 찾으면 된다.',
        reasoning: '단순히 "방법" 키워드만 일치',
        whyBad: '맥락이 전혀 다름. 의미적 연관성 없음'
      }
    ]
  },

  {
    name: '변화와 고정',
    memo: {
      content: '변하지 않는 것은 변화뿐이다. 고정된 것에 집착하면 오히려 멈춘다.',
      tags: ['변화', '고정', '집착']
    },
    expectedGoodIdeas: [
      {
        content: '흐르는 물은 썩지 않는다. 멈춤이 오히려 쇠퇴를 가져온다.',
        reasoning: '변화와 고정의 역설적 관계',
        expectedQuality: 'high'
      },
      {
        content: '강한 자가 살아남는 것이 아니라 변화에 적응하는 자가 살아남는다.',
        reasoning: '변화를 받아들이는 것의 중요성',
        expectedQuality: 'high'
      },
      {
        content: '구르는 돌에는 이끼가 끼지 않는다.',
        reasoning: '지속적 변화의 필요성',
        expectedQuality: 'medium'
      }
    ],
    expectedBadIdeas: [
      {
        content: '변화는 두렵지만 필요하다.',
        reasoning: '단순히 "변화" 키워드만 일치',
        whyBad: '역설적 관계나 깊은 통찰 없음'
      },
      {
        content: '집착을 버려라.',
        reasoning: '단순히 "집착" 키워드만 일치',
        whyBad: '맥락 없는 조언'
      }
    ]
  },

  {
    name: '실패와 성공',
    memo: {
      content: '실패는 성공의 반대가 아니라 성공의 일부다. 실패를 통해 성공에 가까워진다.',
      tags: ['실패', '성공', '성장']
    },
    expectedGoodIdeas: [
      {
        content: '실패는 성공의 어머니. 넘어짐으로써 일어서는 법을 배운다.',
        reasoning: '실패와 성공의 변증법적 관계',
        expectedQuality: 'high'
      },
      {
        content: '99번 실패해도 100번째에 성공하면 된다. 과정이 곧 결과다.',
        reasoning: '실패를 과정으로 보는 관점의 전환',
        expectedQuality: 'high'
      },
      {
        content: '원숭이도 나무에서 떨어진다. 완벽한 성공은 없다.',
        reasoning: '실패의 필연성과 수용',
        expectedQuality: 'medium'
      }
    ],
    expectedBadIdeas: [
      {
        content: '성공하려면 노력해야 한다.',
        reasoning: '단순히 "성공" 키워드만 일치',
        whyBad: '실패와의 관계 설명 없음'
      },
      {
        content: '실패를 두려워하지 마라.',
        reasoning: '단순히 "실패" 키워드만 일치',
        whyBad: '표면적 조언. 깊이 없음'
      }
    ]
  },

  {
    name: '속도와 방향',
    memo: {
      content: '빨리 가는 것보다 올바른 방향으로 가는 것이 중요하다. 속도는 방향 다음이다.',
      tags: ['속도', '방향', '목표']
    },
    expectedGoodIdeas: [
      {
        content: '급할수록 돌아가라. 지름길이 오히려 먼 길이 될 수 있다.',
        reasoning: '속도와 효율성의 역설',
        expectedQuality: 'high'
      },
      {
        content: '천천히 서두르라. 느림 속에 진정한 빠름이 있다.',
        reasoning: '속도의 역설적 이해',
        expectedQuality: 'high'
      },
      {
        content: '방향을 잃으면 속도는 의미가 없다.',
        reasoning: '우선순위의 명확화',
        expectedQuality: 'medium'
      }
    ],
    expectedBadIdeas: [
      {
        content: '빨리 가려면 뛰어야 한다.',
        reasoning: '단순히 "빨리" 키워드만 일치',
        whyBad: '메모의 핵심(속도보다 방향)을 이해하지 못함'
      },
      {
        content: '목표를 세우는 것이 중요하다.',
        reasoning: '단순히 "목표" 키워드만 일치',
        whyBad: '일반적인 조언. 속도와 방향의 관계 설명 없음'
      }
    ]
  },

  {
    name: '소유와 존재',
    memo: {
      content: '많이 가진 자가 아니라 적게 필요로 하는 자가 진정 부유하다.',
      tags: ['소유', '만족', '행복']
    },
    expectedGoodIdeas: [
      {
        content: '버림으로써 얻는다. 소유가 오히려 속박이 될 수 있다.',
        reasoning: '소유의 역설',
        expectedQuality: 'high'
      },
      {
        content: '작은 것에 만족하는 자가 가장 큰 부를 가졌다.',
        reasoning: '부유함의 재정의',
        expectedQuality: 'high'
      },
      {
        content: '족한 줄 아는 자는 욕심이 없다.',
        reasoning: '만족의 가치',
        expectedQuality: 'medium'
      }
    ],
    expectedBadIdeas: [
      {
        content: '돈이 많으면 행복하다.',
        reasoning: '메모와 정반대 내용',
        whyBad: '메모의 핵심(소유≠부유함)과 모순'
      },
      {
        content: '가진 것에 감사하라.',
        reasoning: '단순히 "가진" 키워드만 일치',
        whyBad: '역설적 통찰 없음'
      }
    ]
  }
];

/**
 * 테스트 케이스 실행 헬퍼
 */
export function getTestCaseByName(name: string): TestCase | undefined {
  return qualityTestCases.find(tc => tc.name === name);
}

export function getAllTestCases(): TestCase[] {
  return qualityTestCases;
}
