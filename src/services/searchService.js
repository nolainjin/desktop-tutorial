// 실제 웹 API를 사용한 검색 서비스

// 1. 명언 검색 (Quotable API)
export async function searchQuotes(keywords) {
  try {
    // 키워드를 영어로 간단하게 변환 (실제로는 번역 API가 필요)
    const keywordMap = {
      '성장': 'growth',
      '습관': 'habit',
      '실패': 'failure',
      '성공': 'success',
      '친구': 'friendship',
      '우정': 'friendship',
      '노력': 'effort',
      '도전': 'challenge'
    };

    const englishKeyword = keywordMap[keywords] || 'life';

    const response = await fetch(`https://api.quotable.io/quotes/random?tags=${englishKeyword}&limit=3`);
    if (!response.ok) throw new Error('Quote API failed');

    const quotes = await response.json();

    return quotes.map(q => ({
      type: 'famous-quote',
      content: q.content,
      source: {
        author: q.author,
        title: null,
        year: null,
        url: null,
        category: '위인 명언',
        platform: null
      },
      similarity: 0.75 + Math.random() * 0.2,
      reasoning: `"${keywords}"와 관련된 명언입니다. ${q.author}의 지혜를 통해 새로운 관점을 얻을 수 있습니다.`
    }));
  } catch (error) {
    console.error('명언 검색 실패:', error);
    return [];
  }
}

// 2. Wikipedia 검색
export async function searchWikipedia(keywords) {
  try {
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?` +
      `action=opensearch&search=${encodeURIComponent(keywords)}` +
      `&limit=5&namespace=0&format=json&origin=*`
    );

    if (!response.ok) throw new Error('Wikipedia API failed');

    const [, titles, descriptions, urls] = await response.json();

    // 문장 단위 결과만 필터링 (최소 30자 이상, 온점/문장 포함)
    const filtered = titles
      .map((title, idx) => ({
        title,
        description: descriptions[idx] || '',
        url: urls[idx]
      }))
      .filter(item => {
        const desc = item.description;
        // 최소 30자 이상이고, 온점이나 문장 구조가 있는 것만
        return desc.length >= 30 && (desc.includes('.') || desc.includes('다') || desc.includes('이다'));
      })
      .slice(0, 2);

    return filtered.map((item) => ({
      type: 'academic',
      content: item.description,
      source: {
        author: 'Wikipedia',
        title: item.title,
        year: new Date().getFullYear().toString(),
        url: item.url,
        category: '백과사전',
        platform: 'Wikipedia'
      },
      similarity: 0.7 + Math.random() * 0.15,
      reasoning: `"${keywords}"와 관련된 백과사전 정보입니다. 체계적인 지식을 제공합니다.`
    }));
  } catch (error) {
    console.error('Wikipedia 검색 실패:', error);
    return [];
  }
}

// 3. 한국 속담 검색 (내장 데이터베이스)
const koreanProverbs = [
  {
    content: '백지장도 맞들면 낫다',
    keywords: ['협력', '친구', '우정', '팀워크'],
    reasoning: '함께하는 것의 중요성을 강조합니다.'
  },
  {
    content: '천 리 길도 한 걸음부터',
    keywords: ['성장', '시작', '노력', '목표'],
    reasoning: '작은 시작의 중요성을 일깨워줍니다.'
  },
  {
    content: '티끌 모아 태산',
    keywords: ['성장', '습관', '노력', '축적'],
    reasoning: '작은 것들의 누적이 큰 결과를 만듭니다.'
  },
  {
    content: '구르는 돌에는 이끼가 끼지 않는다',
    keywords: ['성장', '변화', '도전', '활동'],
    reasoning: '계속 움직이고 변화하는 것의 가치를 말합니다.'
  },
  {
    content: '넘어진 김에 쉬어간다',
    keywords: ['실패', '긍정', '여유', '지혜'],
    reasoning: '실패를 긍정적으로 받아들이는 지혜입니다.'
  },
  {
    content: '실패는 성공의 어머니',
    keywords: ['실패', '성공', '배움', '성장'],
    reasoning: '실패를 통해 배우고 성장할 수 있습니다.'
  },
  {
    content: '친구 따라 강남 간다',
    keywords: ['친구', '영향', '관계'],
    reasoning: '좋은 친구의 영향력을 보여줍니다.'
  },
  {
    content: '세 사람이 가면 그 중에 스승이 있다',
    keywords: ['배움', '관계', '지혜', '성장'],
    reasoning: '누구에게서든 배울 수 있다는 개방적 태도입니다.'
  }
];

export function searchKoreanProverbs(keywords) {
  const keywordArr = keywords.split(' ');

  const matches = koreanProverbs.filter(proverb =>
    proverb.keywords.some(k =>
      keywordArr.some(keyword => keyword.includes(k) || k.includes(keyword))
    )
  );

  return matches.slice(0, 2).map(proverb => ({
    type: 'proverb',
    content: proverb.content,
    source: {
      author: '한국 속담',
      title: null,
      year: null,
      url: null,
      category: '고전 속담',
      platform: null
    },
    similarity: 0.8 + Math.random() * 0.15,
    reasoning: proverb.reasoning
  }));
}

// 4. 책 검색 (Google Books API - 무료, API 키 불필요)
export async function searchBooks(keywords) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?` +
      `q=${encodeURIComponent(keywords)}&langRestrict=ko&maxResults=5&orderBy=relevance`
    );

    if (!response.ok) throw new Error('Books API failed');

    const data = await response.json();

    if (!data.items) return [];

    // 설명이 있고 의미 있는 내용만 필터링
    const filtered = data.items
      .filter(item => {
        const desc = item.volumeInfo.description;
        // 최소 50자 이상의 설명이 있어야 함
        return desc && desc.length >= 50;
      })
      .slice(0, 2);

    return filtered.map(item => {
      const volumeInfo = item.volumeInfo;
      // 설명을 200자로 제한
      const description = volumeInfo.description.substring(0, 200) + '...';

      return {
        type: 'book',
        content: description,
        source: {
          author: volumeInfo.authors ? volumeInfo.authors.join(', ') : '저자 미상',
          title: volumeInfo.title,
          year: volumeInfo.publishedDate ? volumeInfo.publishedDate.substring(0, 4) : null,
          url: volumeInfo.infoLink || null,
          category: volumeInfo.categories ? volumeInfo.categories[0] : '도서',
          platform: 'Google Books'
        },
        similarity: 0.7 + Math.random() * 0.2,
        reasoning: `"${keywords}"와 관련된 책입니다. 더 깊이 있는 내용을 탐구할 수 있습니다.`
      };
    });
  } catch (error) {
    console.error('책 검색 실패:', error);
    return [];
  }
}

// 5. 통합 검색
export async function searchAllSources(ideaText, keywords) {
  console.log('🔍 통합 검색 시작:', keywords);

  try {
    // 모든 검색을 병렬로 실행
    const [quotes, wiki, proverbs, books] = await Promise.all([
      searchQuotes(keywords).catch(err => {
        console.error('명언 검색 오류:', err);
        return [];
      }),
      searchWikipedia(keywords).catch(err => {
        console.error('위키 검색 오류:', err);
        return [];
      }),
      Promise.resolve(searchKoreanProverbs(keywords)),
      searchBooks(keywords).catch(err => {
        console.error('책 검색 오류:', err);
        return [];
      })
    ]);

    // 모든 결과 합치기
    const allResults = [...proverbs, ...quotes, ...wiki, ...books];

    // ID 추가
    const resultsWithIds = allResults.map((item, idx) => ({
      ...item,
      id: `search-${Date.now()}-${idx}`,
      ideaId: null,
      userFeedback: null
    }));

    console.log(`✅ 총 ${resultsWithIds.length}개의 연결을 찾았습니다`);

    return resultsWithIds;
  } catch (error) {
    console.error('통합 검색 오류:', error);
    return [];
  }
}

// 키워드 추출 (개선된 버전)
export function extractKeywords(text) {
  // 주요 키워드 패턴 매칭 (확장)
  const keywords = [];

  const patterns = {
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
  const keywordScores = {};

  for (const [key, words] of Object.entries(patterns)) {
    let score = 0;
    for (const word of words) {
      // 정확히 포함되면 높은 점수
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

  // 키워드가 하나도 없으면 제목의 주요 명사 추출
  if (keywords.length === 0) {
    const words = text.split(/\s+/)
      .filter(w => w.length >= 2 && w.length <= 10)
      .slice(0, 3);
    keywords.push(...words);
  }

  return keywords.join(' ');
}
