// 아이디어 상세 렌더링
export function renderIdeaDetail(idea, container) {
  if (!idea) {
    container.innerHTML = `
      <div class="error-message">
        <p>아이디어를 찾을 수 없습니다.</p>
      </div>
    `;
    return;
  }

  const tagsHtml = idea.tags && idea.tags.length > 0
    ? `
      <div class="detail-tags">
        ${idea.tags.map(tag => `<span class="tag tag-large">#${tag}</span>`).join('')}
      </div>
    `
    : '';

  container.innerHTML = `
    <div class="detail-header">
      <h2 class="detail-title">${idea.title}</h2>
      <div class="detail-meta">
        <span class="detail-date">📅 ${formatDetailDate(idea.createdAt)}</span>
      </div>
    </div>

    <div class="detail-content">
      ${formatContent(idea.content)}
    </div>

    ${tagsHtml}

    <div class="detail-actions">
      <button class="btn btn-secondary" data-action="edit">
        ✏️ 수정하기
      </button>
      <button class="btn btn-danger" data-action="delete">
        🗑️ 삭제하기
      </button>
    </div>
  `;

  // 수정 버튼
  const editBtn = container.querySelector('[data-action="edit"]');
  editBtn.addEventListener('click', () => {
    const event = new CustomEvent('idea-edit', { detail: { ideaId: idea.id } });
    document.dispatchEvent(event);
  });

  // 삭제 버튼
  const deleteBtn = container.querySelector('[data-action="delete"]');
  deleteBtn.addEventListener('click', () => {
    if (confirm(`"${idea.title}"을(를) 삭제하시겠습니까?\n\n연결된 모든 내용도 함께 삭제됩니다.`)) {
      const event = new CustomEvent('idea-delete', { detail: { ideaId: idea.id } });
      document.dispatchEvent(event);
    }
  });
}

// 상세 날짜 포맷팅
function formatDetailDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}

// 내용 포맷팅 (줄바꿈 유지)
function formatContent(content) {
  return content
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('');
}

// 로딩 인디케이터 표시
export function showLoading(container) {
  container.style.display = 'flex';
}

// 로딩 인디케이터 숨김
export function hideLoading(container) {
  container.style.display = 'none';
}

// 빈 상태 표시
export function showEmptyState(container) {
  container.style.display = 'flex';
}

// 빈 상태 숨김
export function hideEmptyState(container) {
  container.style.display = 'none';
}
