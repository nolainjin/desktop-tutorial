import Dexie, { Table } from 'dexie';
import { Memo } from '../types/memo';
import { Idea } from '../types/idea';
import { Connection } from '../types/connection';

export class IdeaConnectDB extends Dexie {
  memos!: Table<Memo, string>;
  ideas!: Table<Idea, string>;
  connections!: Table<Connection, string>;

  constructor() {
    super('IdeaConnectDB');

    this.version(1).stores({
      memos: 'id, createdAt, updatedAt, *tags, categoryId',
      ideas: 'id, memoId, type, similarity, createdAt',
      connections: 'id, memoId, ideaId, strength, createdAt',
    });
  }
}

export const db = new IdeaConnectDB();
