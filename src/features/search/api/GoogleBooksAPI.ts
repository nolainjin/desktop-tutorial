import { Idea, IdeaSource } from '../../../types/idea';

// Google Books 검색
export async function searchBooks(keywords: string[]): Promise<Partial<Idea>[]> {
  try {
    const query = keywords.join(' ');
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?` +
      `q=${encodeURIComponent(query)}&langRestrict=ko&maxResults=10&orderBy=relevance`
    );

    if (!response.ok) throw new Error('Books API failed');

    const data = await response.json();

    if (!data.items) return [];

    // 설명이 있고 의미 있는 내용만 필터링
    const filtered = data.items
      .filter((item: any) => {
        const desc = item.volumeInfo.description;
        return desc && desc.length >= 50;
      })
      .slice(0, 5);

    return filtered.map((item: any) => {
      const volumeInfo = item.volumeInfo;
      const description = volumeInfo.description.substring(0, 200) + '...';

      return {
        type: 'book',
        content: description,
        source: {
          author: volumeInfo.authors ? volumeInfo.authors.join(', ') : '저자 미상',
          title: volumeInfo.title,
          year: volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : undefined,
          url: volumeInfo.infoLink || undefined,
          category: volumeInfo.categories ? volumeInfo.categories[0] : '도서',
          platform: 'Google Books'
        } as IdeaSource,
        similarity: 0.7 + Math.random() * 0.2,
        reasoning: `"${keywords.join(', ')}"와 관련된 책입니다. 더 깊이 있는 내용을 탐구할 수 있습니다.`
      };
    });
  } catch (error) {
    console.error('책 검색 실패:', error);
    return [];
  }
}
