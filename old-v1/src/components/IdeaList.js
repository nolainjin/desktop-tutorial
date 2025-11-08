import { getConnections } from '../data/mockData.js';

// 아이디어 카드 렌더링
export function renderIdeaCard(idea) {
  const card = document.createElement('div');
  card.className = 'idea-card';
  card.setAttribute('data-idea-id', idea.id);

  // 연결 개수 확인
  const connections = getConnections(idea.id);
  const connectionCount = connections.length;

  // 내용 미리보기 (처음 100자)
  const preview = idea.content.length > 100
    ? idea.content.substring(0, 100) + '...'
    : idea.content;

  // 태그 렌더링
  const tagsHtml = idea.tags && idea.tags.length > 0
    ? `
      <div class="idea-card__tags">
        ${idea.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
    `
    : '';

  card.innerHTML = `
    <div class="idea-card__header">
      <h3 class="idea-card__title">${idea.title}</h3>
      <div class="idea-card__date">${formatDate(idea.createdAt)}</div>
    </div>

    <div class="idea-card__preview">
      ${preview}
    </div>

    ${tagsHtml}

    <div class="idea-card__footer">
      <div class="idea-card__connections">
        ${connectionCount > 0
          ? `🔗 ${connectionCount}개 연결됨`
          : '연결 없음'
        }
      </div>
      <div class="idea-card__actions">
        <button class="btn-icon btn-edit" data-action="edit" title="수정">
          ✏️
        </button>
        <button class="btn-icon btn-delete" data-action="delete" title="삭제">
          🗑️
        </button>
      </div>
    </div>
  `;

  // 카드 클릭 이벤트 (상세 보기)
  card.addEventListener('click', (e) => {
    // 버튼 클릭은 제외
    if (e.target.closest('.btn-icon')) {
      return;
    }
    const event = new CustomEvent('idea-view', { detail: { ideaId: idea.id } });
    document.dispatchEvent(event);
  });

  // 수정 버튼
  const editBtn = card.querySelector('.btn-edit');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const event = new CustomEvent('idea-edit', { detail: { ideaId: idea.id } });
    document.dispatchEvent(event);
  });

  // 삭제 버튼
  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm(`"${idea.title}"을(를) 삭제하시겠습니까?`)) {
      const event = new CustomEvent('idea-delete', { detail: { ideaId: idea.id } });
      document.dispatchEvent(event);
    }
  });

  return card;
}

// 아이디어 목록 렌더링
export function renderIdeaList(ideas, container) {
  container.innerHTML = '';

  if (!ideas || ideas.length === 0) {
    container.innerHTML = `
      <div class="empty-ideas">
        <div class="empty-ideas__icon">💡</div>
        <h3>아직 아이디어가 없습니다</h3>
        <p>"새 아이디어 작성" 버튼을 눌러 첫 아이디어를 기록해보세요!</p>
      </div>
    `;
    return;
  }

  ideas.forEach((idea, index) => {
    const card = renderIdeaCard(idea);

    // 순차적 애니메이션
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    container.appendChild(card);

    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return '오늘';
  } else if (days === 1) {
    return '어제';
  } else if (days < 7) {
    return `${days}일 전`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks}주 전`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(days / 365);
    return `${years}년 전`;
  }
}
