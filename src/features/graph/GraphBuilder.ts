import { Memo } from '../../types/memo';
import { Idea } from '../../types/idea';

export interface GraphNode {
  id: string;
  label: string;
  type: 'memo' | 'idea';
  ideaType?: string;
  x: number;
  y: number;
  connectionCount?: number;
  memo?: Memo;
  idea?: Idea;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// 그래프 데이터 생성
export function buildGraphData(memos: Memo[], allIdeas: Map<string, Idea[]>): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  // 메모 노드 추가 (원형 배치)
  memos.forEach((memo, index) => {
    const angle = (index / memos.length) * 2 * Math.PI;
    const radius = Math.min(width, height) * 0.3;

    nodes.push({
      id: memo.id,
      label: memo.title.substring(0, 20) + (memo.title.length > 20 ? '...' : ''),
      type: 'memo',
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      connectionCount: memo.connectionCount,
      memo
    });

    // 아이디어 노드 추가 (메모 주변에 배치)
    const ideas = allIdeas.get(memo.id) || [];
    ideas.slice(0, 3).forEach((idea, ideaIndex) => {
      const ideaAngle = angle + (ideaIndex / 3 - 0.5) * (Math.PI / 3);
      const ideaRadius = 100;

      const ideaNodeId = `idea-${idea.id}`;

      // 중복 방지
      if (!nodes.find(n => n.id === ideaNodeId)) {
        nodes.push({
          id: ideaNodeId,
          label: idea.content.substring(0, 15) + '...',
          type: 'idea',
          ideaType: idea.type,
          x: centerX + radius * Math.cos(angle) + ideaRadius * Math.cos(ideaAngle),
          y: centerY + radius * Math.sin(angle) + ideaRadius * Math.sin(ideaAngle),
          idea
        });

        // 링크 추가
        links.push({
          source: memo.id,
          target: ideaNodeId,
          strength: idea.similarity
        });
      }
    });
  });

  return { nodes, links };
}
