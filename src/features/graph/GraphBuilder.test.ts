import { describe, it, expect } from 'vitest';
import { buildGraphData, GraphNode, GraphLink } from './GraphBuilder';
import { Memo } from '../../types/memo';
import { Idea } from '../../types/idea';

describe('GraphBuilder', () => {
  describe('buildGraphData', () => {
    it('빈 메모 배열은 빈 그래프를 생성해야 함', () => {
      const memos: Memo[] = [];
      const ideas = new Map<string, Idea[]>();

      const graph = buildGraphData(memos, ideas);

      expect(graph.nodes).toEqual([]);
      expect(graph.links).toEqual([]);
    });

    it('단일 메모에 대한 노드를 생성해야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '테스트 메모',
        content: '내용',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        connectionCount: 0
      };

      const graph = buildGraphData([memo], new Map());

      expect(graph.nodes).toHaveLength(1);
      expect(graph.nodes[0].id).toBe('memo-1');
      expect(graph.nodes[0].type).toBe('memo');
      expect(graph.nodes[0].label).toBe('테스트 메모');
    });

    it('긴 제목은 20자로 잘라야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '이것은 매우 긴 제목입니다. 20자가 넘습니다.',
        content: '내용',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const graph = buildGraphData([memo], new Map());

      // 실제 substring(0, 20) 결과 확인
      expect(graph.nodes[0].label).toBe('이것은 매우 긴 제목입니다. 20자가...');
      expect(graph.nodes[0].label.endsWith('...')).toBe(true);
    });

    it('메모를 원형으로 배치해야 함', () => {
      const memos: Memo[] = [
        {
          id: 'memo-1',
          title: '메모 1',
          content: '내용 1',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'memo-2',
          title: '메모 2',
          content: '내용 2',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'memo-3',
          title: '메모 3',
          content: '내용 3',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const graph = buildGraphData(memos, new Map());

      expect(graph.nodes).toHaveLength(3);

      // 모든 노드가 중심으로부터 비슷한 거리에 있어야 함 (원형 배치)
      const centerX = 400; // width / 2
      const centerY = 300; // height / 2

      const distances = graph.nodes.map(node => {
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
      });

      // 모든 거리가 비슷해야 함 (원형)
      const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
      distances.forEach(distance => {
        expect(Math.abs(distance - avgDistance)).toBeLessThan(1);
      });
    });

    it('아이디어 노드를 생성하고 메모에 연결해야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모 1',
        content: '내용 1',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        }
      ];

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', ideas);

      const graph = buildGraphData([memo], ideasMap);

      // 메모 노드 1개 + 아이디어 노드 1개
      expect(graph.nodes).toHaveLength(2);

      // 아이디어 노드 확인
      const ideaNode = graph.nodes.find(n => n.type === 'idea');
      expect(ideaNode).toBeDefined();
      expect(ideaNode!.ideaType).toBe('famous-quote');

      // 링크 확인
      expect(graph.links).toHaveLength(1);
      expect(graph.links[0].source).toBe('memo-1');
      expect(graph.links[0].target).toBe('idea-idea-1');
      expect(graph.links[0].strength).toBe(0.8);
    });

    it('메모당 최대 3개의 아이디어만 표시해야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모 1',
        content: '내용 1',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '명언 1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        },
        {
          id: 'idea-2',
          memoId: 'memo-1',
          type: 'book',
          content: '책 2',
          source: { title: 'Book 2' },
          similarity: 0.7,
          reasoning: '이유 2',
          createdAt: new Date()
        },
        {
          id: 'idea-3',
          memoId: 'memo-1',
          type: 'proverb',
          content: '속담 3',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유 3',
          createdAt: new Date()
        },
        {
          id: 'idea-4',
          memoId: 'memo-1',
          type: 'academic',
          content: '학술 4',
          source: { url: 'https://example.com' },
          similarity: 0.6,
          reasoning: '이유 4',
          createdAt: new Date()
        },
        {
          id: 'idea-5',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '명언 5',
          source: { author: 'Author 5' },
          similarity: 0.5,
          reasoning: '이유 5',
          createdAt: new Date()
        }
      ];

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', ideas);

      const graph = buildGraphData([memo], ideasMap);

      // 메모 1개 + 아이디어 3개만
      const ideaNodes = graph.nodes.filter(n => n.type === 'idea');
      expect(ideaNodes).toHaveLength(3);
      expect(graph.links).toHaveLength(3);
    });

    it('아이디어 콘텐츠를 15자로 잘라야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모 1',
        content: '내용 1',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const ideas: Idea[] = [
        {
          id: 'idea-1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '이것은 매우 긴 아이디어 콘텐츠입니다. 15자가 훨씬 넘습니다.',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유 1',
          createdAt: new Date()
        }
      ];

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', ideas);

      const graph = buildGraphData([memo], ideasMap);

      const ideaNode = graph.nodes.find(n => n.type === 'idea');
      // 실제 substring(0, 15) 결과 확인
      expect(ideaNode!.label).toBe('이것은 매우 긴 아이디어 콘...');
      expect(ideaNode!.label.endsWith('...')).toBe(true);
    });

    it('중복 아이디어 노드를 방지해야 함', () => {
      const memos: Memo[] = [
        {
          id: 'memo-1',
          title: '메모 1',
          content: '내용 1',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'memo-2',
          title: '메모 2',
          content: '내용 2',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // 같은 아이디어 ID를 공유
      const sharedIdea: Idea = {
        id: 'shared-idea',
        memoId: 'memo-1',
        type: 'famous-quote',
        content: '공유 명언',
        source: { author: 'Author' },
        similarity: 0.8,
        reasoning: '이유',
        createdAt: new Date()
      };

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', [sharedIdea]);
      ideasMap.set('memo-2', [{ ...sharedIdea, memoId: 'memo-2' }]);

      const graph = buildGraphData(memos, ideasMap);

      // 아이디어 노드가 중복되지 않아야 함
      const ideaNodeIds = graph.nodes
        .filter(n => n.type === 'idea')
        .map(n => n.id);

      const uniqueIds = new Set(ideaNodeIds);
      expect(ideaNodeIds.length).toBe(uniqueIds.size);
    });

    it('여러 메모와 아이디어로 복잡한 그래프를 생성해야 함', () => {
      const memos: Memo[] = [
        {
          id: 'memo-1',
          title: '메모 1',
          content: '내용 1',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          connectionCount: 2
        },
        {
          id: 'memo-2',
          title: '메모 2',
          content: '내용 2',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          connectionCount: 1
        },
        {
          id: 'memo-3',
          title: '메모 3',
          content: '내용 3',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          connectionCount: 0
        }
      ];

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', [
        {
          id: 'idea-1-1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '명언 1-1',
          source: { author: 'Author 1' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        },
        {
          id: 'idea-1-2',
          memoId: 'memo-1',
          type: 'book',
          content: '책 1-2',
          source: { title: 'Book' },
          similarity: 0.7,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);
      ideasMap.set('memo-2', [
        {
          id: 'idea-2-1',
          memoId: 'memo-2',
          type: 'proverb',
          content: '속담 2-1',
          source: { author: '한국 속담' },
          similarity: 0.9,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      const graph = buildGraphData(memos, ideasMap);

      // 메모 3개 + 아이디어 3개
      expect(graph.nodes).toHaveLength(6);
      expect(graph.nodes.filter(n => n.type === 'memo')).toHaveLength(3);
      expect(graph.nodes.filter(n => n.type === 'idea')).toHaveLength(3);

      // 링크 3개 (memo-1에 2개, memo-2에 1개)
      expect(graph.links).toHaveLength(3);

      // connectionCount 확인
      const memo1Node = graph.nodes.find(n => n.id === 'memo-1');
      expect(memo1Node!.connectionCount).toBe(2);
    });

    it('아이디어가 없는 메모도 처리해야 함', () => {
      const memos: Memo[] = [
        {
          id: 'memo-1',
          title: '아이디어 있음',
          content: '내용',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'memo-2',
          title: '아이디어 없음',
          content: '내용',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', [
        {
          id: 'idea-1',
          memoId: 'memo-1',
          type: 'famous-quote',
          content: '명언',
          source: { author: 'Author' },
          similarity: 0.8,
          reasoning: '이유',
          createdAt: new Date()
        }
      ]);

      const graph = buildGraphData(memos, ideasMap);

      // 메모 2개 + 아이디어 1개
      expect(graph.nodes).toHaveLength(3);
      expect(graph.links).toHaveLength(1);

      // memo-2는 아이디어가 없지만 노드는 생성됨
      const memo2Node = graph.nodes.find(n => n.id === 'memo-2');
      expect(memo2Node).toBeDefined();
    });

    it('메모와 아이디어 객체를 노드에 포함해야 함', () => {
      const memo: Memo = {
        id: 'memo-1',
        title: '메모 1',
        content: '내용 1',
        tags: ['태그1'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const idea: Idea = {
        id: 'idea-1',
        memoId: 'memo-1',
        type: 'famous-quote',
        content: '명언',
        source: { author: 'Author' },
        similarity: 0.8,
        reasoning: '이유',
        createdAt: new Date()
      };

      const ideasMap = new Map<string, Idea[]>();
      ideasMap.set('memo-1', [idea]);

      const graph = buildGraphData([memo], ideasMap);

      const memoNode = graph.nodes.find(n => n.type === 'memo');
      const ideaNode = graph.nodes.find(n => n.type === 'idea');

      expect(memoNode!.memo).toEqual(memo);
      expect(ideaNode!.idea).toEqual(idea);
    });
  });
});
