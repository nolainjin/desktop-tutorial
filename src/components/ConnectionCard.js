import { saveFeedback, getFeedback } from '../data/mockData.js';
import { validateConnection } from '../utils/validation.js';

// 타입별 아이콘
const TYPE_ICONS = {
  quote: '💬',
  web: '🌐',
  movie: '🎬',
  memo: '📝'
};

// 타입별 레이블
const TYPE_LABELS = {
  quote: '명언/속담',
  web: '웹 자료',
  movie: '영화 대사',
  memo: '내 메모'
};

// 타입별 색상 클래스
const TYPE_CLASSES = {
  quote: 'connection-card--quote',
  web: 'connection-card--web',
  movie: 'connection-card--movie',
  memo: 'connection-card--memo'
};

// 연결 카드 렌더링
export function renderConnectionCard(connection) {
  // 검증
  validateConnection(connection);

  const icon = TYPE_ICONS[connection.type] || '📄';
  const label = TYPE_LABELS[connection.type] || connection.type;
  const typeClass = TYPE_CLASSES[connection.type] || '';

  // 저장된 피드백 확인
  const savedFeedback = getFeedback(connection.id);
  const upActive = savedFeedback === 'up' ? 'active' : '';
  const downActive = savedFeedback === 'down' ? 'active' : '';

  const card = document.createElement('div');
  card.className = `connection-card ${typeClass}`;
  card.setAttribute('data-connection-id', connection.id);

  // 피드백이 down이면 숨김
  if (savedFeedback === 'down') {
    card.style.display = 'none';
  }

  card.innerHTML = `
    <div class="connection-card__header">
      <span class="connection-card__type">
        ${icon} ${label}
      </span>
      <span class="connection-card__similarity">
        ${Math.round(connection.similarity * 100)}% 관련도
      </span>
    </div>

    <div class="connection-card__content">
      ${connection.content}
    </div>

    ${renderSourceBox(connection.source, connection.type)}

    <div class="connection-card__reasoning">
      <div class="reasoning-label">💭 연결 이유</div>
      <div class="reasoning-content">${connection.reasoning}</div>
    </div>

    ${connection.incomplete ? renderWarning(connection.warnings) : ''}

    <div class="connection-card__feedback">
      <button class="feedback-btn feedback-btn--up ${upActive}" data-action="up">
        👍 관련있음
      </button>
      <button class="feedback-btn feedback-btn--down ${downActive}" data-action="down">
        👎 관련없음
      </button>
    </div>
  `;

  // 피드백 버튼 이벤트
  const feedbackButtons = card.querySelectorAll('.feedback-btn');
  feedbackButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      handleFeedback(connection.id, action, card);
    });
  });

  return card;
}

// 출처 정보 박스 렌더링
function renderSourceBox(source, type) {
  if (!source) {
    return `
      <div class="source-box source-box--missing">
        <div class="source-warning">⚠️ 출처 정보가 없습니다</div>
      </div>
    `;
  }

  const items = [];

  // 타입별 출처 정보 구성
  switch (type) {
    case 'quote':
      if (source.author) {
        items.push(renderSourceItem('✍️', '저자', source.author));
      } else {
        items.push(renderSourceItem('⚠️', '저자', '출처 불명', true));
      }

      if (source.title) {
        items.push(renderSourceItem('📚', '출처', source.title));
      } else if (source.category) {
        items.push(renderSourceItem('🏷️', '분류', source.category));
      }

      if (source.year) {
        items.push(renderSourceItem('📅', '연도', source.year));
      }
      break;

    case 'web':
      if (source.author) {
        items.push(renderSourceItem('✍️', '저자', source.author));
      }

      if (source.title) {
        items.push(renderSourceItem('📚', '제목', source.title));
      }

      if (source.year) {
        items.push(renderSourceItem('📅', '연도', source.year));
      }

      if (source.url) {
        items.push(renderSourceLink('🔗', '링크', source.url, source.platform));
      } else {
        items.push(renderSourceItem('⚠️', '링크', '링크 없음', true));
      }

      if (source.category) {
        items.push(renderSourceItem('🏷️', '분류', source.category));
      }
      break;

    case 'movie':
      if (source.title) {
        items.push(renderSourceItem('🎥', '영화', source.title));
      }

      if (source.author) {
        items.push(renderSourceItem('👤', '인물', source.author));
      }

      if (source.year) {
        items.push(renderSourceItem('📅', '연도', source.year));
      }

      if (source.category) {
        items.push(renderSourceItem('🏷️', '장르', source.category));
      }
      break;

    case 'memo':
      items.push(renderSourceItem('📝', '내 메모', '직접 작성'));
      break;
  }

  if (items.length === 0) {
    return `
      <div class="source-box source-box--missing">
        <div class="source-warning">⚠️ 출처 정보가 불완전합니다</div>
      </div>
    `;
  }

  return `
    <div class="source-box">
      <div class="source-box__title">📦 출처 정보</div>
      <div class="source-box__items">
        ${items.join('')}
      </div>
    </div>
  `;
}

// 출처 항목 렌더링
function renderSourceItem(icon, label, value, isWarning = false) {
  const warningClass = isWarning ? 'source-item--warning' : '';
  return `
    <div class="source-item ${warningClass}">
      <span class="source-icon">${icon}</span>
      <span class="source-label">${label}:</span>
      <span class="source-value">${value}</span>
    </div>
  `;
}

// 출처 링크 렌더링
function renderSourceLink(icon, label, url, platform) {
  const displayText = platform || '바로가기';
  return `
    <div class="source-item">
      <span class="source-icon">${icon}</span>
      <span class="source-label">${label}:</span>
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="source-link">
        ${displayText}
      </a>
    </div>
  `;
}

// 경고 메시지 렌더링
function renderWarning(warnings) {
  if (!warnings || warnings.length === 0) return '';

  return `
    <div class="connection-card__warning">
      <div class="warning-title">⚠️ 검증 경고</div>
      <ul class="warning-list">
        ${warnings.map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>
  `;
}

// 피드백 처리
function handleFeedback(connectionId, action, cardElement) {
  const upBtn = cardElement.querySelector('.feedback-btn--up');
  const downBtn = cardElement.querySelector('.feedback-btn--down');

  if (action === 'up') {
    // 좋아요
    upBtn.classList.toggle('active');
    downBtn.classList.remove('active');

    const isActive = upBtn.classList.contains('active');
    saveFeedback(connectionId, isActive ? 'up' : null);

    if (isActive) {
      // 간단한 애니메이션
      cardElement.style.transform = 'scale(0.98)';
      setTimeout(() => {
        cardElement.style.transform = '';
      }, 200);
    }
  } else if (action === 'down') {
    // 싫어요 - 카드를 페이드아웃하고 숨김
    downBtn.classList.add('active');
    upBtn.classList.remove('active');
    saveFeedback(connectionId, 'down');

    cardElement.style.opacity = '0';
    cardElement.style.transform = 'scale(0.95)';

    setTimeout(() => {
      cardElement.style.display = 'none';
    }, 300);
  }
}

// 여러 연결 카드 렌더링
export function renderConnectionCards(connections, container) {
  container.innerHTML = '';

  if (!connections || connections.length === 0) {
    container.innerHTML = `
      <div class="empty-connections">
        <p>아직 연결된 내용이 없습니다.</p>
        <p>위의 "연결 찾기" 버튼을 눌러보세요!</p>
      </div>
    `;
    return;
  }

  connections.forEach((connection, index) => {
    const card = renderConnectionCard(connection);

    // 순차적 애니메이션
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    container.appendChild(card);

    setTimeout(() => {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}
