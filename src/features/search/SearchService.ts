import { Idea, IdeaType } from '../../types/idea';
import { Memo } from '../../types/memo';
import { searchQuotes } from './api/QuotableAPI';
import { searchWikipedia } from './api/WikipediaAPI';
import { searchBooks } from './api/GoogleBooksAPI';
import { koreanProverbs } from './api/ProverbsDB';
import { searchLocalQuotes } from './api/LocalQuotesDB';
import { extractKeywords } from './KeywordExtractor';
import { calculateSimilarity } from './SimilarityCalculator';
import { v4 as uuidv4 } from 'uuid';

// 한국 속담 검색
function searchKoreanProverbs(keywords: string[]): Partial<Idea>[] {
  const matches = koreanProverbs.filter(proverb =>
    proverb.keywords.some(k =>
      keywords.some(keyword => keyword.includes(k) || k.includes(keyword))
    )
  );

  return matches.slice(0, 2).map(proverb => ({
    type: 'proverb',
    content: proverb.content,
    source: {
      author: '한국 속담',
      category: proverb.category,
    },
    similarity: 0.8 + Math.random() * 0.15,
    reasoning: proverb.keywords.join(', ') + '와 관련된 지혜입니다.'
  }));
}

// 통합 검색 (타입 필터 지원)
export async function searchAllSources(
  memo: Memo,
  selectedTypes: IdeaType[] = []
): Promise<Idea[]> {
  console.log('🔍 통합 검색 시작:', memo.title);

  // 키워드 추출
  const keywords = extractKeywords(memo.content, memo.tags);
  console.log('📝 추출된 키워드:', keywords);

  try {
    // 타입 필터가 없으면 모든 타입 검색
    const shouldSearch = {
      'famous-quote': selectedTypes.length === 0 || selectedTypes.includes('famous-quote'),
      'academic': selectedTypes.length === 0 || selectedTypes.includes('academic'),
      'proverb': selectedTypes.length === 0 || selectedTypes.includes('proverb'),
      'book': selectedTypes.length === 0 || selectedTypes.includes('book')
    };

    // 선택된 타입만 검색 (병렬 실행)
    const searchPromises: Promise<Partial<Idea>[]>[] = [];

    if (shouldSearch['famous-quote']) {
      // 로컬 DB 우선 검색 (빠르고 정확)
      searchPromises.push(
        searchLocalQuotes(keywords).catch(err => {
          console.error('로컬 명언 검색 오류:', err);
          return [];
        })
      );

      // 외부 API 검색 (추가 명언)
      searchPromises.push(
        searchQuotes(keywords).catch(err => {
          console.error('API 명언 검색 오류:', err);
          return [];
        })
      );
    }

    if (shouldSearch['academic']) {
      searchPromises.push(
        searchWikipedia(keywords).catch(err => {
          console.error('위키 검색 오류:', err);
          return [];
        })
      );
    }

    if (shouldSearch['proverb']) {
      searchPromises.push(Promise.resolve(searchKoreanProverbs(keywords)));
    }

    if (shouldSearch['book']) {
      searchPromises.push(
        searchBooks(keywords).catch(err => {
          console.error('책 검색 오류:', err);
          return [];
        })
      );
    }

    const results = await Promise.all(searchPromises);
    const allResults = results.flat();

    // 중복 제거 (content 기준)
    const uniqueResults: Partial<Idea>[] = [];
    const seenContents = new Set<string>();

    for (const item of allResults) {
      const contentKey = item.content?.substring(0, 50) || '';
      if (!seenContents.has(contentKey) && item.content) {
        seenContents.add(contentKey);
        uniqueResults.push(item);
      }
    }

    // 유사도 재계산
    const resultsWithSimilarity = uniqueResults.map(item => {
      const similarity = calculateSimilarity(
        memo.content,
        item.content || '',
        memo.tags
      );
      return {
        ...item,
        similarity: Math.max(similarity, item.similarity || 0)
      };
    });

    // 유사도 필터링 (0.3 이상만)
    const filtered = resultsWithSimilarity.filter(item => (item.similarity || 0) >= 0.3);

    // 유사도 순으로 정렬
    filtered.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

    // 최대 10개로 제한
    const limited = filtered.slice(0, 10);

    // 완전한 Idea 객체로 변환
    const ideas: Idea[] = limited.map(item => ({
      id: uuidv4(),
      memoId: memo.id,
      type: item.type!,
      content: item.content!,
      source: item.source!,
      similarity: item.similarity!,
      reasoning: item.reasoning!,
      createdAt: new Date()
    }));

    console.log(`✅ 총 ${ideas.length}개의 연결을 찾았습니다`);

    return ideas;
  } catch (error) {
    console.error('통합 검색 오류:', error);
    return [];
  }
}

// 연결성 검증 (최소 1개 이상 연결 필요)
export function validateConnection(ideas: Idea[]): boolean {
  return ideas.length >= 1 && ideas.some(idea => idea.similarity >= 0.3);
}
