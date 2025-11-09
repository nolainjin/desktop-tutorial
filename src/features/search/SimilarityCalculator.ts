// 유사도 계산
export function calculateSimilarity(text1: string, text2: string, tags: string[] = []): number {
  // 1. Jaccard Similarity (단어 집합)
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  const jaccardScore = intersection.size / union.size;

  // 2. 키워드 매칭 점수
  let keywordScore = 0;
  const keywords = ['성장', '습관', '실패', '성공', '친구', '배움', '노력'];

  for (const keyword of keywords) {
    if (text1.includes(keyword) && text2.includes(keyword)) {
      keywordScore += 0.1;
    }
  }

  // 3. 태그 매칭 보너스
  let tagBonus = 0;
  for (const tag of tags) {
    if (text2.includes(tag)) {
      tagBonus += 0.1;
    }
  }

  // 가중 평균
  const finalScore = (jaccardScore * 0.5) + (keywordScore * 0.3) + (tagBonus * 0.2);

  return Math.min(finalScore, 1.0);
}

// 코사인 유사도 (간단 버전)
export function cosineSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);

  const wordSet = new Set([...words1, ...words2]);
  const vector1: number[] = [];
  const vector2: number[] = [];

  for (const word of wordSet) {
    vector1.push(words1.filter(w => w === word).length);
    vector2.push(words2.filter(w => w === word).length);
  }

  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
}
