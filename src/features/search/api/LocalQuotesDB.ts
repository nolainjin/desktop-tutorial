import { Idea, IdeaSource } from '../../../types/idea';

interface LocalQuote {
  id: string;
  content: string;
  author: string;
  keywords: string[];
  category: string;
  type: 'famous-quote' | 'proverb';
  language: 'ko' | 'en';
}

let cachedQuotes: LocalQuote[] | null = null;

/**
 * 로컬 명언 데이터베이스 로드 (캐싱)
 */
async function loadQuotes(): Promise<LocalQuote[]> {
  if (cachedQuotes) {
    return cachedQuotes;
  }

  try {
    // 영문 + 한글 명언 모두 로드
    const [enResponse, koResponse] = await Promise.all([
      fetch('/data/quotes.json'),
      fetch('/data/korean-quotes.json')
    ]);

    const enQuotes = await enResponse.json();
    const koQuotes = await koResponse.json();

    cachedQuotes = [...enQuotes, ...koQuotes];
    console.log(`✅ 로컬 명언 ${cachedQuotes.length}개 로드 완료`);

    return cachedQuotes;
  } catch (error) {
    console.error('❌ 로컬 명언 로드 실패:', error);
    return [];
  }
}

/**
 * 로컬 명언 검색
 */
export async function searchLocalQuotes(keywords: string[]): Promise<Partial<Idea>[]> {
  try {
    const quotes = await loadQuotes();

    if (quotes.length === 0) {
      return [];
    }

    // 키워드와 매칭되는 명언 찾기
    const matches = quotes.filter(quote => {
      // 키워드가 quote.keywords에 하나라도 포함되는지 확인
      return keywords.some(keyword =>
        quote.keywords.includes(keyword)
      );
    });

    // 관련도 점수 계산
    const scored = matches.map(quote => {
      // 매칭된 키워드 개수로 점수 계산
      const matchCount = keywords.filter(k =>
        quote.keywords.includes(k)
      ).length;

      const similarity = 0.6 + (matchCount * 0.1); // 0.6 ~ 0.9

      return {
        quote,
        similarity: Math.min(similarity, 0.95)
      };
    });

    // 점수 순으로 정렬하고 상위 5개만
    const topMatches = scored
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Idea 형식으로 변환
    return topMatches.map(({ quote, similarity }) => ({
      type: 'famous-quote' as const,
      content: quote.content,
      source: {
        author: quote.author,
        category: quote.category,
        platform: '로컬 데이터베이스'
      } as IdeaSource,
      similarity,
      reasoning: `"${keywords.join(', ')}"와 관련된 ${quote.language === 'ko' ? '한국어' : '영어'} 명언입니다. ${quote.author}의 통찰을 통해 새로운 관점을 얻을 수 있습니다.`
    }));

  } catch (error) {
    console.error('로컬 명언 검색 실패:', error);
    return [];
  }
}

/**
 * 캐시 초기화 (개발용)
 */
export function clearQuotesCache() {
  cachedQuotes = null;
}
