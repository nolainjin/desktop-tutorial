// 키워드 추출 (개선된 버전)
export function extractKeywords(text: string, tags: string[] = []): string[] {
  const keywords: string[] = [];

  // 주요 키워드 패턴 매칭
  const patterns: Record<string, string[]> = {
    '성장': ['성장', '발전', '진보', '개선', '향상', '나아가'],
    '습관': ['습관', '반복', '루틴', '매일'],
    '실패': ['실패', '좌절', '어려움', '넘어지', '실수'],
    '성공': ['성공', '달성', '이루', '이룬', '목표'],
    '친구': ['친구', '우정', '동료', '관계'],
    '배움': ['배우', '학습', '공부', '지식', '배움'],
    '노력': ['노력', '시도', '도전', '과감', '용기'],
    '변화': ['변화', '바꾸', '달라지', '전환'],
    '행복': ['행복', '기쁨', '즐거', '만족'],
    '사랑': ['사랑', '애정', '정'],
    '자유': ['자유', '해방', '독립'],
    '창의': ['창의', '창조', '독창'],
    '지혜': ['지혜', '현명', '슬기'],
    '꿈': ['꿈', '희망', '바람', '소망'],
    '용기': ['용기', '담대', '과감', '두려움']
  };

  // 키워드 매칭 및 가중치 계산
  const keywordScores: Record<string, number> = {};

  for (const [key, words] of Object.entries(patterns)) {
    let score = 0;
    for (const word of words) {
      if (text.includes(word)) {
        score += 2;
      }
    }
    if (score > 0) {
      keywordScores[key] = score;
    }
  }

  // 점수가 높은 순으로 정렬
  const sorted = Object.entries(keywordScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);

  keywords.push(...sorted);

  // 태그도 키워드에 포함
  keywords.push(...tags.slice(0, 2));

  // 키워드가 하나도 없으면 제목의 주요 명사 추출
  if (keywords.length === 0) {
    const words = text
      .split(/\s+/)
      .filter(w => w.length >= 2 && w.length <= 10)
      .slice(0, 3);
    keywords.push(...words);
  }

  // 중복 제거
  return [...new Set(keywords)];
}
