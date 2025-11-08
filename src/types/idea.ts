export type IdeaType =
  | 'movie'          // 영화 대사
  | 'drama'          // 드라마 대사
  | 'animation'      // 애니메이션 대사
  | 'book'           // 책
  | 'essay'          // 에세이
  | 'poem'           // 시
  | 'famous-quote'   // 위인 명언
  | 'proverb'        // 속담
  | 'academic'       // 학문적 내용
  | 'web'            // 웹 자료
  | 'memo';          // 내 메모 (다른 메모와의 연결)

export interface IdeaSource {
  author?: string;               // 저자/인물
  title?: string;                // 작품명/제목
  year?: string;                 // 연도
  url?: string;                  // 출처 URL
  category?: string;             // 세부 분류
  platform?: string;             // 플랫폼 (Wikipedia, Google Books 등)
}

export interface Idea {
  id: string;                    // UUID
  memoId: string;                // 연결된 메모 ID
  type: IdeaType;                // 아이디어 타입
  content: string;               // 문장 내용
  source: IdeaSource;            // 출처 정보
  similarity: number;            // 유사도 점수 (0-1)
  reasoning: string;             // 연결 이유 설명
  createdAt: Date;               // 추가일시
  userFeedback?: 'up' | 'down';  // 사용자 피드백
}
