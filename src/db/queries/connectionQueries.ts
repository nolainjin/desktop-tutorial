import { v4 as uuidv4 } from 'uuid';
import { db } from '../schema';
import { Connection } from '../../types/connection';

/**
 * 연결 생성
 */
export async function createConnection(
  memoId: string,
  ideaId: string,
  strength: number = 1.0
): Promise<Connection> {
  // 이미 존재하는 연결인지 확인
  const existing = await db.connections
    .where({ memoId, ideaId })
    .first();

  if (existing) {
    return existing;
  }

  const connection: Connection = {
    id: uuidv4(),
    memoId,
    ideaId,
    strength,
    createdAt: new Date(),
    isAutomatic: false, // 사용자가 직접 선택한 연결
  };

  await db.connections.add(connection);
  return connection;
}

/**
 * 연결 삭제
 */
export async function deleteConnection(memoId: string, ideaId: string): Promise<void> {
  await db.connections
    .where({ memoId, ideaId })
    .delete();
}

/**
 * 메모의 모든 연결 조회
 */
export async function getConnectionsByMemoId(memoId: string): Promise<Connection[]> {
  return await db.connections
    .where('memoId')
    .equals(memoId)
    .toArray();
}

/**
 * 모든 연결 조회
 */
export async function getAllConnections(): Promise<Connection[]> {
  return await db.connections.toArray();
}

/**
 * 메모의 모든 연결 삭제
 */
export async function deleteConnectionsByMemoId(memoId: string): Promise<void> {
  await db.connections
    .where('memoId')
    .equals(memoId)
    .delete();
}

/**
 * 특정 연결이 존재하는지 확인
 */
export async function connectionExists(memoId: string, ideaId: string): Promise<boolean> {
  const connection = await db.connections
    .where({ memoId, ideaId })
    .first();

  return !!connection;
}
