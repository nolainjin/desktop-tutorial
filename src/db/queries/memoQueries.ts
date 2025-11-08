import { db } from '../schema';
import { Memo, CreateMemoInput, UpdateMemoInput } from '../../types/memo';
import { v4 as uuidv4 } from 'uuid';

// 모든 메모 가져오기
export async function getAllMemos(): Promise<Memo[]> {
  return await db.memos.orderBy('updatedAt').reverse().toArray();
}

// ID로 메모 가져오기
export async function getMemoById(id: string): Promise<Memo | undefined> {
  return await db.memos.get(id);
}

// 메모 생성
export async function createMemo(input: CreateMemoInput): Promise<Memo> {
  const now = new Date();
  const memo: Memo = {
    id: uuidv4(),
    title: input.title,
    content: input.content,
    tags: input.tags || [],
    createdAt: now,
    updatedAt: now,
    connectionCount: 0,
  };

  await db.memos.add(memo);
  return memo;
}

// 메모 업데이트
export async function updateMemo(
  id: string,
  input: UpdateMemoInput
): Promise<Memo | undefined> {
  const memo = await db.memos.get(id);
  if (!memo) return undefined;

  const updatedMemo: Memo = {
    ...memo,
    ...input,
    updatedAt: new Date(),
  };

  await db.memos.update(id, updatedMemo);
  return updatedMemo;
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  await db.memos.delete(id);
  // 연결된 아이디어와 커넥션도 삭제
  await db.ideas.where('memoId').equals(id).delete();
  await db.connections.where('memoId').equals(id).delete();
}

// 검색 (제목 + 내용)
export async function searchMemos(query: string): Promise<Memo[]> {
  const lowerQuery = query.toLowerCase();
  return await db.memos
    .filter(
      (memo) =>
        memo.title.toLowerCase().includes(lowerQuery) ||
        memo.content.toLowerCase().includes(lowerQuery)
    )
    .toArray();
}

// 태그로 필터링
export async function getMemosByTag(tag: string): Promise<Memo[]> {
  return await db.memos.where('tags').equals(tag).toArray();
}
