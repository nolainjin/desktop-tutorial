export interface Memo {
  id: string;                    // UUID
  title: string;                 // 제목 (최대 200자)
  content: string;               // 마크다운 내용
  tags: string[];                // 태그 배열
  createdAt: Date;               // 생성일시
  updatedAt: Date;               // 수정일시
  connectionCount: number;       // 연결된 아이디어 수
  categoryId?: string;           // 소속 범주 (optional)
}

export interface CreateMemoInput {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateMemoInput {
  title?: string;
  content?: string;
  tags?: string[];
}
