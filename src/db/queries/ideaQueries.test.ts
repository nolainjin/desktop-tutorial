import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getIdeasByMemoId,
  saveIdeas,
  deleteIdeasByMemoId,
  updateIdeaFeedback,
  updateMemoConnectionCount
} from './ideaQueries';
import { createMemo } from './memoQueries';
import { db } from '../schema';
import { Idea } from '../../types/idea';

describe('ideaQueries', () => {
  let testMemoId: string;

  beforeEach(async () => {
    // 각 테스트 전에 데이터베이스 초기화
    await db.memos.clear();
    await db.ideas.clear();
    await db.connections.clear();

    // 테스트용 메모 생성
    const memo = await createMemo({
      title: '테스트 메모',
      content: '테스트 내용'
    });
    testMemoId = memo.id;
  });

  afterEach(async () => {
    await db.memos.clear();
    await db.ideas.clear();
    await db.connections.clear();
  });

  describe('saveIdeas', () => {
    it('여러 아이디어를 저장해야 함', async () => {
      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '성공은 습관이다',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '성장 관련 명언',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: testMemoId,
          type: 'academic',
          content: '습관의 과학',
          source: { url: 'https://example.com' },
          similarity: 0.7,
          reasoning: '학술 정보',
          createdAt: new Date()
        }
      ];

      await saveIdeas(ideas);

      const saved = await db.ideas.toArray();
      expect(saved).toHaveLength(2);
    });

    it('빈 배열도 처리할 수 있어야 함', async () => {
      await saveIdeas([]);

      const ideas = await db.ideas.toArray();
      expect(ideas).toHaveLength(0);
    });
  });

  describe('getIdeasByMemoId', () => {
    beforeEach(async () => {
      // 테스트 데이터 추가
      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: testMemoId,
          type: 'book',
          content: '책 1',
          source: { title: 'Book 1' },
          similarity: 0.7,
          reasoning: '이유 2',
          createdAt: new Date()
        }
      ];

      await saveIdeas(ideas);
    });

    it('메모 ID로 아이디어를 가져와야 함', async () => {
      const ideas = await getIdeasByMemoId(testMemoId);

      expect(ideas).toHaveLength(2);
      expect(ideas.every(idea => idea.memoId === testMemoId)).toBe(true);
    });

    it('아이디어가 없으면 빈 배열을 반환해야 함', async () => {
      const ideas = await getIdeasByMemoId('non-existent-memo-id');
      expect(ideas).toEqual([]);
    });

    it('다른 메모의 아이디어는 반환하지 않아야 함', async () => {
      const otherMemo = await createMemo({ title: '다른 메모', content: '내용' });

      await saveIdeas([
        {
          id: 'idea-3',
          memoId: otherMemo.id,
          type: 'proverb',
          content: '속담',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      const ideas = await getIdeasByMemoId(testMemoId);

      expect(ideas).toHaveLength(2);
      expect(ideas.every(idea => idea.memoId === testMemoId)).toBe(true);
    });
  });

  describe('deleteIdeasByMemoId', () => {
    beforeEach(async () => {
      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언',
          source: { author: 'Author' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: testMemoId,
          type: 'book',
          content: '책',
          source: { title: 'Book' },
          similarity: 0.7,
          reasoning: '이유',
          createdAt: new Date()
        }
      ];

      await saveIdeas(ideas);
    });

    it('메모 ID로 아이디어를 삭제해야 함', async () => {
      await deleteIdeasByMemoId(testMemoId);

      const ideas = await getIdeasByMemoId(testMemoId);
      expect(ideas).toHaveLength(0);
    });

    it('다른 메모의 아이디어는 삭제하지 않아야 함', async () => {
      const otherMemo = await createMemo({ title: '다른 메모', content: '내용' });

      await saveIdeas([
        {
          id: 'idea-3',
          memoId: otherMemo.id,
          type: 'proverb',
          content: '속담',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      await deleteIdeasByMemoId(testMemoId);

      const otherIdeas = await getIdeasByMemoId(otherMemo.id);
      expect(otherIdeas).toHaveLength(1);
    });

    it('존재하지 않는 메모 ID도 에러 없이 처리해야 함', async () => {
      await expect(deleteIdeasByMemoId('non-existent')).resolves.not.toThrow();
    });
  });

  describe('updateIdeaFeedback', () => {
    let ideaId: string;

    beforeEach(async () => {
      ideaId = 'idea-feedback-test';
      await saveIdeas([
        {
          id: ideaId,
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언',
          source: { author: 'Author' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);
    });

    it('아이디어에 긍정 피드백을 추가해야 함', async () => {
      await updateIdeaFeedback(ideaId, 'up');

      const idea = await db.ideas.get(ideaId);
      expect(idea!.userFeedback).toBe('up');
    });

    it('아이디어에 부정 피드백을 추가해야 함', async () => {
      await updateIdeaFeedback(ideaId, 'down');

      const idea = await db.ideas.get(ideaId);
      expect(idea!.userFeedback).toBe('down');
    });

    it('피드백을 변경할 수 있어야 함', async () => {
      await updateIdeaFeedback(ideaId, 'up');
      await updateIdeaFeedback(ideaId, 'down');

      const idea = await db.ideas.get(ideaId);
      expect(idea!.userFeedback).toBe('down');
    });
  });

  describe('updateMemoConnectionCount', () => {
    it('메모의 연결 개수를 업데이트해야 함', async () => {
      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: testMemoId,
          type: 'book',
          content: '책 1',
          source: { title: 'Book 1' },
          similarity: 0.7,
          reasoning: '이유 2',
          createdAt: new Date()
        },
        {
          id: 'idea-3',
          memoId: testMemoId,
          type: 'proverb',
          content: '속담 1',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유 3',
          createdAt: new Date()
        }
      ];

      await saveIdeas(ideas);
      await updateMemoConnectionCount(testMemoId);

      const memo = await db.memos.get(testMemoId);
      expect(memo!.connectionCount).toBe(3);
    });

    it('아이디어가 없으면 0으로 업데이트해야 함', async () => {
      await updateMemoConnectionCount(testMemoId);

      const memo = await db.memos.get(testMemoId);
      expect(memo!.connectionCount).toBe(0);
    });

    it('아이디어 삭제 후 개수를 업데이트해야 함', async () => {
      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: testMemoId,
          type: 'book',
          content: '책 1',
          source: { title: 'Book 1' },
          similarity: 0.7,
          reasoning: '이유 2',
          createdAt: new Date()
        }
      ];

      await saveIdeas(ideas);
      await updateMemoConnectionCount(testMemoId);

      let memo = await db.memos.get(testMemoId);
      expect(memo!.connectionCount).toBe(2);

      // 하나 삭제
      await db.ideas.delete('idea-1');
      await updateMemoConnectionCount(testMemoId);

      memo = await db.memos.get(testMemoId);
      expect(memo!.connectionCount).toBe(1);
    });
  });

  describe('통합 시나리오', () => {
    it('아이디어 전체 흐름이 정상적으로 작동해야 함', async () => {
      const ideas: Idea[] = [
        {
          id: 'idea-integration-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '통합 테스트 명언',
          source: { author: 'Author' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        }
      ];

      // 저장
      await saveIdeas(ideas);

      // 조회
      let savedIdeas = await getIdeasByMemoId(testMemoId);
      expect(savedIdeas).toHaveLength(1);

      // 피드백 업데이트
      await updateIdeaFeedback('idea-integration-1', 'up');
      const idea = await db.ideas.get('idea-integration-1');
      expect(idea!.userFeedback).toBe('up');

      // 연결 개수 업데이트
      await updateMemoConnectionCount(testMemoId);
      const memo = await db.memos.get(testMemoId);
      expect(memo!.connectionCount).toBe(1);

      // 삭제
      await deleteIdeasByMemoId(testMemoId);
      savedIdeas = await getIdeasByMemoId(testMemoId);
      expect(savedIdeas).toHaveLength(0);
    });

    it('여러 메모의 아이디어를 독립적으로 관리해야 함', async () => {
      const memo2 = await createMemo({ title: '메모 2', content: '내용 2' });

      // 첫 번째 메모에 아이디어 추가
      await saveIdeas([
        {
          id: 'idea-memo1-1',
          memoId: testMemoId,
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      // 두 번째 메모에 아이디어 추가
      await saveIdeas([
        {
          id: 'idea-memo2-1',
          memoId: memo2.id,
          type: 'book',
          content: '책 1',
          source: { title: 'Book 1' },
          similarity: 0.7,
          reasoning: '이유',
          createdAt: new Date()
        },
        {
          id: 'idea-memo2-2',
          memoId: memo2.id,
          type: 'proverb',
          content: '속담 1',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      // 각 메모의 아이디어 개수 확인
      const ideas1 = await getIdeasByMemoId(testMemoId);
      const ideas2 = await getIdeasByMemoId(memo2.id);

      expect(ideas1).toHaveLength(1);
      expect(ideas2).toHaveLength(2);

      // 연결 개수 업데이트
      await updateMemoConnectionCount(testMemoId);
      await updateMemoConnectionCount(memo2.id);

      const updatedMemo1 = await db.memos.get(testMemoId);
      const updatedMemo2 = await db.memos.get(memo2.id);

      expect(updatedMemo1!.connectionCount).toBe(1);
      expect(updatedMemo2!.connectionCount).toBe(2);
    });
  });
});
