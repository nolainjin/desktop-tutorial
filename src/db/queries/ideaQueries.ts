import { db } from '../schema';
import { Idea } from '../../types/idea';

// 메모의 모든 아이디어 가져오기
export async function getIdeasByMemoId(memoId: string): Promise<Idea[]> {
  return await db.ideas.where('memoId').equals(memoId).toArray();
}

// 아이디어 저장 (복수)
export async function saveIdeas(ideas: Idea[]): Promise<void> {
  await db.ideas.bulkAdd(ideas);
}

// 아이디어 삭제 (메모 ID 기준)
export async function deleteIdeasByMemoId(memoId: string): Promise<void> {
  await db.ideas.where('memoId').equals(memoId).delete();
}

// 아이디어 피드백 업데이트
export async function updateIdeaFeedback(
  ideaId: string,
  feedback: 'up' | 'down'
): Promise<void> {
  await db.ideas.update(ideaId, { userFeedback: feedback });
}

// 아이디어 개수 업데이트 (메모의 connectionCount)
export async function updateMemoConnectionCount(memoId: string, count?: number): Promise<void> {
  if (count !== undefined) {
    await db.memos.update(memoId, { connectionCount: count });
  } else {
    const ideas = await getIdeasByMemoId(memoId);
    await db.memos.update(memoId, { connectionCount: ideas.length });
  }
}
