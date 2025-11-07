import { getIdeas, getConnections } from '../data/mockData.js';

// 타입별 색상 (CSS 변수와 동일)
const TYPE_COLORS = {
  'movie': '#EF4444',
  'drama': '#EC4899',
  'animation': '#F59E0B',
  'book': '#3B82F6',
  'essay': '#06B6D4',
  'famous-quote': '#8B5CF6',
  'proverb': '#4F46E5',
  'academic': '#10B981',
  'web': '#14B8A6',
  'memo': '#6366F1'
};

// 그래프 렌더링
export function renderGraph(container) {
  const ideas = getIdeas();

  if (!ideas || ideas.length === 0) {
    container.innerHTML = `
      <div class="graph-empty">
        <div class="graph-empty-icon">🌐</div>
        <h3>아직 아이디어가 없습니다</h3>
        <p>아이디어를 작성하고 연결을 찾아보세요!</p>
      </div>
    `;
    return;
  }

  // 그래프 데이터 구성
  const nodes = [];
  const links = [];

  // 아이디어 노드 추가
  ideas.forEach(idea => {
    const connections = getConnections(idea.id);
    nodes.push({
      id: idea.id,
      label: idea.title.substring(0, 20) + (idea.title.length > 20 ? '...' : ''),
      type: 'idea',
      connectionCount: connections.length
    });

    // 연결 노드 추가 (최대 3개만)
    connections.slice(0, 3).forEach(conn => {
      const connId = `conn-${conn.id}`;
      // 중복 방지
      if (!nodes.find(n => n.id === connId)) {
        nodes.push({
          id: connId,
          label: conn.content.substring(0, 15) + '...',
          type: conn.type,
          ideaId: idea.id
        });

        links.push({
          source: idea.id,
          target: connId,
          type: conn.type
        });
      }
    });
  });

  // SVG 생성
  const width = container.clientWidth || 800;
  const height = 600;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'graph-svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // 링크 그룹
  const linksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  linksGroup.setAttribute('class', 'links');
  svg.appendChild(linksGroup);

  // 노드 그룹
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('class', 'nodes');
  svg.appendChild(nodesGroup);

  // 간단한 원형 레이아웃
  const centerX = width / 2;
  const centerY = height / 2;

  // 아이디어를 중심에 배치
  const ideaNodes = nodes.filter(n => n.type === 'idea');
  const connNodes = nodes.filter(n => n.type !== 'idea');

  // 아이디어 노드 위치 계산 (원형 배치)
  ideaNodes.forEach((node, i) => {
    const angle = (i / ideaNodes.length) * 2 * Math.PI;
    const radius = Math.min(width, height) * 0.25;
    node.x = centerX + radius * Math.cos(angle);
    node.y = centerY + radius * Math.sin(angle);
  });

  // 연결 노드 위치 계산 (각 아이디어 주변에 배치)
  connNodes.forEach((node) => {
    const ideaNode = ideaNodes.find(n => n.id === node.ideaId);
    if (ideaNode) {
      const connIndex = connNodes.filter(n => n.ideaId === node.ideaId).indexOf(node);
      const totalConns = connNodes.filter(n => n.ideaId === node.ideaId).length;
      const angle = (connIndex / totalConns) * 2 * Math.PI;
      const radius = 80;
      node.x = ideaNode.x + radius * Math.cos(angle);
      node.y = ideaNode.y + radius * Math.sin(angle);
    }
  });

  // 링크 그리기
  links.forEach(link => {
    const source = nodes.find(n => n.id === link.source);
    const target = nodes.find(n => n.id === link.target);

    if (source && target) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'graph-link');
      line.setAttribute('x1', source.x);
      line.setAttribute('y1', source.y);
      line.setAttribute('x2', target.x);
      line.setAttribute('y2', target.y);
      line.setAttribute('stroke', TYPE_COLORS[link.type] || '#D1D5DB');
      linksGroup.appendChild(line);
    }
  });

  // 노드 그리기
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'graph-node');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'node-circle');
    circle.setAttribute('r', node.type === 'idea' ? 40 : 25);
    circle.setAttribute('fill', node.type === 'idea' ? '#667eea' : (TYPE_COLORS[node.type] || '#9CA3AF'));
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '3');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'node-label');
    text.setAttribute('y', node.type === 'idea' ? 55 : 40);
    text.setAttribute('fill', '#374151');
    text.textContent = node.label;

    // 클릭 이벤트
    g.style.cursor = 'pointer';
    g.addEventListener('click', () => {
      if (node.type === 'idea') {
        const event = new CustomEvent('idea-view', { detail: { ideaId: node.id } });
        document.dispatchEvent(event);
      }
    });

    // 호버 효과
    g.addEventListener('mouseenter', () => {
      circle.setAttribute('stroke-width', '5');
      if (node.type === 'idea') {
        // 연결된 링크 하이라이트
        const relatedLinks = links.filter(l => l.source === node.id || l.target === node.id);
        relatedLinks.forEach(link => {
          const linkElements = linksGroup.querySelectorAll('.graph-link');
          linkElements.forEach(el => {
            const x1 = parseFloat(el.getAttribute('x1'));
            const y1 = parseFloat(el.getAttribute('y1'));
            const sourceNode = nodes.find(n => n.x === x1 && n.y === y1);
            if (sourceNode && sourceNode.id === node.id) {
              el.classList.add('hover');
            }
          });
        });
      }
    });

    g.addEventListener('mouseleave', () => {
      circle.setAttribute('stroke-width', '3');
      const linkElements = linksGroup.querySelectorAll('.graph-link');
      linkElements.forEach(el => el.classList.remove('hover'));
    });

    g.appendChild(circle);
    g.appendChild(text);
    nodesGroup.appendChild(g);
  });

  container.innerHTML = '';
  container.appendChild(svg);
}
