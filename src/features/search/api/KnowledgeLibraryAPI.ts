import { Idea, IdeaSource, IdeaType } from '../../../types/idea';

/**
 * 지식 라이브러리 아이템 인터페이스
 */
interface LibraryItem {
  id: string;
  content: string;
  content_ko?: string;
  content_en?: string;
  author?: string;
  author_ko?: string;
  author_en?: string;
  source?: {
    title?: string;
    year?: string;
    category?: string;
    platform?: string;
  };
  keywords: string[];
  type: IdeaType;
  language: string;
  rating?: number;
  verified?: boolean;
  createdAt?: string;
}

/**
 * 라이브러리 캐시
 */
const libraryCache: Map<IdeaType, LibraryItem[]> = new Map();
let isLoading = false;

/**
 * 특정 카테고리의 라이브러리 데이터 로드
 */
async function loadLibraryCategory(category: IdeaType): Promise<LibraryItem[]> {
  // 캐시 확인
  if (libraryCache.has(category)) {
    return libraryCache.get(category)!;
  }

  // 파일명 매핑
  const fileMap: Record<string, string> = {
    'famous-quote': 'famous-quotes.json',
    'movie': 'movie-quotes.json',
    'book': 'book-quotes.json',
    'proverb': 'proverbs.json',
    'academic': 'academic.json',
    'essay': 'essays.json',
    'poem': 'poems.json',
    'drama': 'drama-quotes.json',
    'animation': 'animation-quotes.json',
    'web': 'web-articles.json',
  };

  const fileName = fileMap[category];
  if (!fileName) {
    console.warn(`⚠️ 지원하지 않는 카테고리: ${category}`);
    return [];
  }

  try {
    // public 폴더는 자동으로 base path 적용됨
    const url = `./data/knowledge-base/library/${fileName}`;

    console.log(`🔄 ${category} 로딩 중: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    libraryCache.set(category, data);
    console.log(`✅ ${category} 라이브러리 로드: ${data.length}개`);
    return data;
  } catch (error) {
    console.error(`❌ ${category} 라이브러리 로드 실패:`, error);
    return [];
  }
}

/**
 * 모든 라이브러리 데이터 로드 (앱 시작 시)
 */
export async function preloadAllLibraries(): Promise<void> {
  if (isLoading) return;
  isLoading = true;

  const categories: IdeaType[] = [
    'famous-quote',
    'movie',
    'book',
    'proverb',
    'academic',
    'essay',
    'poem',
    'drama',
    'animation',
    'web',
  ];

  console.log('🚀 지식 라이브러리 로딩 시작...');

  // 순차적으로 로드 (브라우저 부담 줄이기)
  for (const category of categories) {
    await loadLibraryCategory(category);
  }

  const totalCount = Array.from(libraryCache.values()).reduce(
    (sum, items) => sum + items.length,
    0
  );

  console.log(`✅ 전체 라이브러리 로드 완료: ${totalCount.toLocaleString()}개`);
  isLoading = false;
}

/**
 * 라이브러리에서 검색
 */
export async function searchLibrary(
  keywords: string[],
  categories: IdeaType[] = ['famous-quote', 'movie', 'book', 'proverb'],
  limit: number = 10
): Promise<Partial<Idea>[]> {
  try {
    const results: Partial<Idea>[] = [];

    // 각 카테고리에서 검색
    for (const category of categories) {
      const items = await loadLibraryCategory(category);

      // 키워드 매칭
      const matches = items.filter((item) => {
        const searchText = `${item.content} ${item.keywords.join(' ')} ${item.author || ''}`.toLowerCase();
        return keywords.some((kw) => searchText.includes(kw.toLowerCase()));
      });

      // 점수 계산
      const scored = matches.map((item) => {
        let score = 0;
        const searchText = `${item.content} ${item.keywords.join(' ')}`.toLowerCase();

        keywords.forEach((kw) => {
          const kwLower = kw.toLowerCase();
          // 키워드에 정확히 매칭되면 높은 점수
          if (item.keywords.some((k) => k.toLowerCase() === kwLower)) {
            score += 3;
          }
          // 내용에 포함되면 중간 점수
          if (item.content.toLowerCase().includes(kwLower)) {
            score += 2;
          }
          // 전체 텍스트에 포함되면 낮은 점수
          if (searchText.includes(kwLower)) {
            score += 1;
          }
        });

        return { item, score };
      });

      // 상위 결과만 선택
      const topResults = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.ceil(limit / categories.length))
        .map(({ item, score }) => convertToIdea(item, score, keywords));

      results.push(...topResults);
    }

    // 전체에서 상위 limit개 선택
    return results
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('❌ 라이브러리 검색 실패:', error);
    return [];
  }
}

/**
 * LibraryItem을 Idea로 변환
 */
function convertToIdea(
  item: LibraryItem,
  score: number,
  keywords: string[]
): Partial<Idea> {
  // 한글 우선, 없으면 영어
  const content = item.content_ko || item.content;
  const author = item.author_ko || item.author;

  const source: IdeaSource = {
    author,
    title: item.source?.title,
    year: item.source?.year,
    category: item.source?.category,
    platform: item.source?.platform,
  };

  // 유사도 계산 (0-1 범위로 정규화)
  const similarity = Math.min(score / 10, 1);

  // 연결 이유 생성
  const matchedKeywords = keywords.filter((kw) =>
    item.keywords.some((k) => k.toLowerCase().includes(kw.toLowerCase()))
  );

  const reasoning =
    matchedKeywords.length > 0
      ? `"${matchedKeywords.join('", "')}" 키워드가 관련되어 있습니다.`
      : '내용이 유사합니다.';

  return {
    id: item.id,
    type: item.type,
    content,
    source,
    similarity,
    reasoning,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
}

/**
 * 통계 조회
 */
export function getLibraryStats(): Record<IdeaType, number> {
  const stats: Record<string, number> = {};

  libraryCache.forEach((items, category) => {
    stats[category] = items.length;
  });

  return stats as Record<IdeaType, number>;
}
