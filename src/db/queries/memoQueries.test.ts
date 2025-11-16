import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getAllMemos,
  getMemoById,
  createMemo,
  updateMemo,
  deleteMemo,
  searchMemos,
  getMemosByTag
} from './memoQueries';
import { db } from '../schema';
import { Memo } from '../../types/memo';

describe('memoQueries', () => {
  beforeEach(async () => {
    // 각 테스트 전에 데이터베이스 초기화
    await db.memos.clear();
    await db.ideas.clear();
    await db.connections.clear();
  });

  afterEach(async () => {
    // 테스트 후 정리
    await db.memos.clear();
    await db.ideas.clear();
    await db.connections.clear();
  });

  describe('createMemo', () => {
    it('새로운 메모를 생성해야 함', async () => {
      const input = {
        title: '테스트 메모',
        content: '테스트 내용',
        tags: ['태그1', '태그2']
      };

      const memo = await createMemo(input);

      expect(memo.id).toBeDefined();
      expect(memo.title).toBe(input.title);
      expect(memo.content).toBe(input.content);
      expect(memo.tags).toEqual(input.tags);
      expect(memo.createdAt).toBeInstanceOf(Date);
      expect(memo.updatedAt).toBeInstanceOf(Date);
      expect(memo.connectionCount).toBe(0);
    });

    it('태그 없이 메모를 생성할 수 있어야 함', async () => {
      const input = {
        title: '태그 없는 메모',
        content: '내용'
      };

      const memo = await createMemo(input);

      expect(memo.tags).toEqual([]);
    });

    it('생성된 메모가 데이터베이스에 저장되어야 함', async () => {
      const input = {
        title: '저장 테스트',
        content: '내용'
      };

      const memo = await createMemo(input);
      const retrieved = await db.memos.get(memo.id);

      expect(retrieved).toBeDefined();
      expect(retrieved!.title).toBe(input.title);
    });
  });

  describe('getAllMemos', () => {
    it('모든 메모를 가져와야 함', async () => {
      await createMemo({ title: '메모1', content: '내용1' });
      await createMemo({ title: '메모2', content: '내용2' });
      await createMemo({ title: '메모3', content: '내용3' });

      const memos = await getAllMemos();

      expect(memos).toHaveLength(3);
    });

    it('최신 수정일 순으로 정렬되어야 함', async () => {
      const memo1 = await createMemo({ title: '메모1', content: '내용1' });

      // 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 10));

      const memo2 = await createMemo({ title: '메모2', content: '내용2' });

      // memo1 업데이트
      await updateMemo(memo1.id, { title: '메모1 수정' });

      const memos = await getAllMemos();

      // memo1이 가장 최근에 업데이트되어 첫 번째에 와야 함
      expect(memos[0].id).toBe(memo1.id);
    });

    it('메모가 없으면 빈 배열을 반환해야 함', async () => {
      const memos = await getAllMemos();
      expect(memos).toEqual([]);
    });
  });

  describe('getMemoById', () => {
    it('ID로 메모를 가져와야 함', async () => {
      const created = await createMemo({ title: '테스트', content: '내용' });
      const memo = await getMemoById(created.id);

      expect(memo).toBeDefined();
      expect(memo!.id).toBe(created.id);
      expect(memo!.title).toBe('테스트');
    });

    it('존재하지 않는 ID는 undefined를 반환해야 함', async () => {
      const memo = await getMemoById('non-existent-id');
      expect(memo).toBeUndefined();
    });
  });

  describe('updateMemo', () => {
    it('메모를 업데이트해야 함', async () => {
      const created = await createMemo({ title: '원본', content: '원본 내용' });

      const updated = await updateMemo(created.id, {
        title: '수정됨',
        content: '수정된 내용'
      });

      expect(updated).toBeDefined();
      expect(updated!.title).toBe('수정됨');
      expect(updated!.content).toBe('수정된 내용');
      expect(updated!.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    it('부분 업데이트를 지원해야 함', async () => {
      const created = await createMemo({
        title: '원본',
        content: '원본 내용',
        tags: ['태그1']
      });

      const updated = await updateMemo(created.id, {
        title: '제목만 수정'
      });

      expect(updated!.title).toBe('제목만 수정');
      expect(updated!.content).toBe('원본 내용');
      expect(updated!.tags).toEqual(['태그1']);
    });

    it('존재하지 않는 메모는 undefined를 반환해야 함', async () => {
      const result = await updateMemo('non-existent', { title: '수정' });
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMemo', () => {
    it('메모를 삭제해야 함', async () => {
      const memo = await createMemo({ title: '삭제될 메모', content: '내용' });

      await deleteMemo(memo.id);

      const retrieved = await getMemoById(memo.id);
      expect(retrieved).toBeUndefined();
    });

    it('메모 삭제 시 연결된 아이디어도 삭제되어야 함', async () => {
      const memo = await createMemo({ title: '메모', content: '내용' });

      // 아이디어 추가
      await db.ideas.add({
        id: 'idea-1',
        memoId: memo.id,
        type: 'famous-quote',
        content: '명언',
        source: { author: 'Author' },
        similarity: 0.8,
        reasoning: '이유',
        createdAt: new Date()
      });

      await deleteMemo(memo.id);

      const ideas = await db.ideas.where('memoId').equals(memo.id).toArray();
      expect(ideas).toHaveLength(0);
    });

    it('메모 삭제 시 연결(connections)도 삭제되어야 함', async () => {
      const memo = await createMemo({ title: '메모', content: '내용' });

      // 연결 추가
      await db.connections.add({
        id: 'conn-1',
        memoId: memo.id,
        ideaId: 'idea-1',
        createdAt: new Date()
      });

      await deleteMemo(memo.id);

      const connections = await db.connections.where('memoId').equals(memo.id).toArray();
      expect(connections).toHaveLength(0);
    });
  });

  describe('searchMemos', () => {
    beforeEach(async () => {
      await createMemo({ title: '성장하는 습관', content: '매일 성장하는 습관을 만들자' });
      await createMemo({ title: '독서 노트', content: '책을 읽고 생각을 정리하자' });
      await createMemo({ title: '운동 기록', content: '매일 30분 걷기 성공!' });
    });

    it('제목으로 메모를 검색해야 함', async () => {
      const results = await searchMemos('독서');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('독서 노트');
    });

    it('내용으로 메모를 검색해야 함', async () => {
      const results = await searchMemos('성장');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(m => m.title === '성장하는 습관')).toBe(true);
    });

    it('대소문자를 구분하지 않아야 함', async () => {
      const results = await searchMemos('성장');
      expect(results.length).toBeGreaterThan(0);
    });

    it('부분 일치로 검색해야 함', async () => {
      const results = await searchMemos('매일');

      expect(results.length).toBe(2); // '성장하는 습관'과 '운동 기록'
    });

    it('검색어가 없으면 빈 배열을 반환해야 함', async () => {
      const results = await searchMemos('존재하지않는검색어xyz');
      expect(results).toEqual([]);
    });

    it('빈 검색어는 모든 메모를 반환해야 함', async () => {
      const results = await searchMemos('');
      expect(results.length).toBe(3);
    });
  });

  describe('getMemosByTag', () => {
    beforeEach(async () => {
      await createMemo({
        title: '메모1',
        content: '내용1',
        tags: ['자기계발', '습관']
      });
      await createMemo({
        title: '메모2',
        content: '내용2',
        tags: ['독서', '자기계발']
      });
      await createMemo({
        title: '메모3',
        content: '내용3',
        tags: ['운동']
      });
    });

    it('특정 태그를 가진 메모를 필터링해야 함', async () => {
      const results = await getMemosByTag('자기계발');

      expect(results).toHaveLength(2);
      expect(results.every(m => m.tags.includes('자기계발'))).toBe(true);
    });

    it('태그가 없으면 빈 배열을 반환해야 함', async () => {
      const results = await getMemosByTag('존재하지않는태그');
      expect(results).toEqual([]);
    });

    it('정확히 일치하는 태그만 반환해야 함', async () => {
      const results = await getMemosByTag('습관');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('메모1');
    });
  });

  describe('통합 시나리오', () => {
    it('CRUD 전체 흐름이 정상적으로 작동해야 함', async () => {
      // Create
      const created = await createMemo({
        title: '통합 테스트',
        content: '내용',
        tags: ['테스트']
      });
      expect(created.id).toBeDefined();

      // Read
      const retrieved = await getMemoById(created.id);
      expect(retrieved).toBeDefined();

      // Update
      const updated = await updateMemo(created.id, {
        title: '수정된 제목'
      });
      expect(updated!.title).toBe('수정된 제목');

      // Delete
      await deleteMemo(created.id);
      const deleted = await getMemoById(created.id);
      expect(deleted).toBeUndefined();
    });
  });
});
