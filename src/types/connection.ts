export interface Connection {
  id: string;                    // UUID
  memoId: string;                // 메모 ID
  ideaId: string;                // 아이디어 ID
  strength: number;              // 연결 강도 (0-1)
  createdAt: Date;               // 연결 생성일시
  isAutomatic: boolean;          // 자동 생성 여부
}
