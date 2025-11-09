import { useEffect, useState, useRef } from 'react';
import { Memo } from '../../types/memo';
import { Idea } from '../../types/idea';
import { buildGraphData, GraphNode, GraphLink } from '../../features/graph/GraphBuilder';

interface GraphViewProps {
  memos: Memo[];
  allIdeas: Map<string, Idea[]>;
  onNodeClick: (node: GraphNode) => void;
}

const TYPE_COLORS: Record<string, string> = {
  'movie': '#EF4444',
  'drama': '#EC4899',
  'animation': '#F59E0B',
  'book': '#3B82F6',
  'essay': '#06B6D4',
  'poem': '#14B8A6',
  'famous-quote': '#8B5CF6',
  'proverb': '#4F46E5',
  'academic': '#10B981',
  'web': '#14B8A6'
};

export function GraphView({ memos, allIdeas, onNodeClick }: GraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: []
  });

  useEffect(() => {
    if (memos.length > 0) {
      const data = buildGraphData(memos, allIdeas);
      setGraphData(data);
    }
  }, [memos, allIdeas]);

  if (memos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-xl font-semibold mb-2">아직 메모가 없습니다</h3>
          <p>메모를 작성하고 연결을 찾아보세요!</p>
        </div>
      </div>
    );
  }

  const { nodes, links } = graphData;

  return (
    <div className="card p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">연결 그래프</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          메모를 클릭하여 상세 내용을 확인하세요
        </p>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-auto bg-gray-50 dark:bg-gray-800 rounded-lg"
        style={{ minHeight: '600px' }}
      >
        {/* 링크 */}
        <g className="links">
          {links.map((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);

            if (!sourceNode || !targetNode) return null;

            const isHovered =
              hoveredNode === sourceNode.id || hoveredNode === targetNode.id;

            return (
              <line
                key={index}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHovered ? '#3B82F6' : '#D1D5DB'}
                strokeWidth={isHovered ? 2 : 1}
                opacity={isHovered ? 0.8 : 0.3}
                className="transition-all"
              />
            );
          })}
        </g>

        {/* 노드 */}
        <g className="nodes">
          {nodes.map(node => {
            const isMemo = node.type === 'memo';
            const radius = isMemo ? 30 : 20;
            const color = isMemo
              ? '#667eea'
              : TYPE_COLORS[node.ideaType || 'web'] || '#9CA3AF';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onNodeClick(node)}
              >
                <circle
                  r={radius}
                  fill={color}
                  stroke="white"
                  strokeWidth={hoveredNode === node.id ? 4 : 2}
                  className="transition-all"
                />
                <text
                  y={isMemo ? radius + 20 : radius + 15}
                  textAnchor="middle"
                  fontSize={isMemo ? 14 : 12}
                  fill="currentColor"
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>
                {isMemo && node.connectionCount && node.connectionCount > 0 && (
                  <text
                    y={0}
                    textAnchor="middle"
                    fontSize={10}
                    fill="white"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {node.connectionCount}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 범례 */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#667eea' }}
          />
          <span>메모</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#EF4444' }}
          />
          <span>영화</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#3B82F6' }}
          />
          <span>책</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#8B5CF6' }}
          />
          <span>명언</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: '#10B981' }}
          />
          <span>학문</span>
        </div>
      </div>
    </div>
  );
}
