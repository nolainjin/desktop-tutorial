import { Idea, IdeaSource } from '../../../types/idea';

// Wikipedia 검색
export async function searchWikipedia(keywords: string[]): Promise<Partial<Idea>[]> {
  try {
    const query = keywords.join(' ');
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?` +
      `action=opensearch&search=${encodeURIComponent(query)}` +
      `&limit=10&namespace=0&format=json&origin=*`
    );

    if (!response.ok) throw new Error('Wikipedia API failed');

    const [, titles, descriptions, urls] = await response.json();

    // 문장 단위 결과만 필터링 (최소 30자 이상)
    const filtered = titles
      .map((title: string, idx: number) => ({
        title,
        description: descriptions[idx] || '',
        url: urls[idx]
      }))
      .filter((item: any) => {
        const desc = item.description;
        return desc.length >= 30 && (desc.includes('.') || desc.includes('다') || desc.includes('이다'));
      })
      .slice(0, 5);

    return filtered.map((item: any) => ({
      type: 'academic',
      content: item.description,
      source: {
        author: 'Wikipedia',
        title: item.title,
        year: new Date().getFullYear().toString(),
        url: item.url,
        category: '백과사전',
        platform: 'Wikipedia'
      } as IdeaSource,
      similarity: 0.7 + Math.random() * 0.15,
      reasoning: `"${keywords.join(', ')}"와 관련된 백과사전 정보입니다. 체계적인 지식을 제공합니다.`
    }));
  } catch (error) {
    console.error('Wikipedia 검색 실패:', error);
    return [];
  }
}
