import { Idea, IdeaSource } from '../../../types/idea';

// 영문 명언 검색 (Quotable API)
export async function searchQuotes(keywords: string[]): Promise<Partial<Idea>[]> {
  try {
    // 키워드를 영어로 간단하게 매핑
    const keywordMap: Record<string, string> = {
      '성장': 'growth',
      '습관': 'habit',
      '실패': 'failure',
      '성공': 'success',
      '친구': 'friendship',
      '우정': 'friendship',
      '노력': 'effort',
      '도전': 'challenge',
      '사랑': 'love',
      '행복': 'happiness',
      '배움': 'learning',
      '지혜': 'wisdom'
    };

    const englishKeyword = keywords
      .map(k => keywordMap[k])
      .find(k => k) || 'life';

    const response = await fetch(
      `https://api.quotable.io/quotes/random?tags=${englishKeyword}&limit=3`
    );

    if (!response.ok) throw new Error('Quote API failed');

    const quotes = await response.json();

    return quotes.map((q: any) => ({
      type: 'famous-quote',
      content: q.content,
      source: {
        author: q.author,
        category: '위인 명언',
      } as IdeaSource,
      similarity: 0.75 + Math.random() * 0.2,
      reasoning: `"${keywords.join(', ')}"와 관련된 명언입니다. ${q.author}의 지혜를 통해 새로운 관점을 얻을 수 있습니다.`
    }));
  } catch (error) {
    console.error('명언 검색 실패:', error);
    return [];
  }
}
