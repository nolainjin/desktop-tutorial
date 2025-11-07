import {
  getIdeas,
  getIdea,
  addIdea,
  updateIdea,
  deleteIdea,
  getConnections,
  saveConnections,
  findConnectionsForIdea
} from './data/mockData.js';

import { validateIdea, parseTags } from './utils/validation.js';
import { renderIdeaList } from './components/IdeaList.js';
import { renderIdeaDetail, showLoading, hideLoading, showEmptyState, hideEmptyState } from './components/IdeaDetail.js';
import { renderConnectionCards } from './components/ConnectionCard.js';

// 앱 상태
const state = {
  currentView: 'home', // 'home', 'edit', 'detail'
  currentIdeaId: null,
  editingIdeaId: null
};

// DOM 요소
const elements = {
  homeView: null,
  editView: null,
  detailView: null,
  ideaList: null,
  ideaForm: null,
  ideaDetail: null,
  connectionsContainer: null,
  loadingIndicator: null,
  emptyState: null,
  newIdeaBtn: null,
  cancelBtn: null,
  backBtn: null,
  findConnectionsBtn: null
};

// 앱 초기화
function init() {
  console.log('💡 IdeaConnect 앱 초기화 시작');

  // DOM 요소 캐싱
  elements.homeView = document.getElementById('home-view');
  elements.editView = document.getElementById('edit-view');
  elements.detailView = document.getElementById('detail-view');
  elements.ideaList = document.getElementById('idea-list');
  elements.ideaForm = document.getElementById('idea-form');
  elements.ideaDetail = document.getElementById('idea-detail');
  elements.connectionsContainer = document.getElementById('connections-container');
  elements.loadingIndicator = document.getElementById('loading-indicator');
  elements.emptyState = document.getElementById('empty-state');
  elements.newIdeaBtn = document.getElementById('new-idea-btn');
  elements.cancelBtn = document.getElementById('cancel-btn');
  elements.backBtn = document.getElementById('back-btn');
  elements.findConnectionsBtn = document.getElementById('find-connections-btn');

  // 필수 요소 확인
  if (!elements.findConnectionsBtn) {
    console.error('❌ 연결 찾기 버튼을 찾을 수 없습니다');
  } else {
    console.log('✅ 연결 찾기 버튼 찾음');
  }

  // 이벤트 리스너 등록
  setupEventListeners();

  // 초기 화면 렌더링
  showView('home');
  refreshIdeaList();

  console.log('✅ IdeaConnect 앱 초기화 완료');
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 새 아이디어 작성 버튼
  elements.newIdeaBtn.addEventListener('click', () => {
    state.editingIdeaId = null;
    showEditView();
  });

  // 취소 버튼
  elements.cancelBtn.addEventListener('click', () => {
    showView('home');
  });

  // 뒤로가기 버튼
  elements.backBtn.addEventListener('click', () => {
    showView('home');
  });

  // 폼 제출
  elements.ideaForm.addEventListener('submit', handleFormSubmit);

  // 연결 찾기 버튼
  if (elements.findConnectionsBtn) {
    elements.findConnectionsBtn.addEventListener('click', () => {
      console.log('🔘 연결 찾기 버튼 클릭됨');
      handleFindConnections();
    });
    console.log('✅ 연결 찾기 이벤트 리스너 등록됨');
  } else {
    console.error('❌ 연결 찾기 버튼이 없어서 이벤트 리스너를 등록할 수 없습니다');
  }

  // 커스텀 이벤트 리스너
  document.addEventListener('idea-view', (e) => {
    showDetailView(e.detail.ideaId);
  });

  document.addEventListener('idea-edit', (e) => {
    state.editingIdeaId = e.detail.ideaId;
    showEditView();
  });

  document.addEventListener('idea-delete', (e) => {
    handleDeleteIdea(e.detail.ideaId);
  });
}

// 화면 전환
function showView(viewName) {
  // 모든 화면 숨김
  elements.homeView.classList.remove('active');
  elements.editView.classList.remove('active');
  elements.detailView.classList.remove('active');

  // 요청된 화면 표시
  state.currentView = viewName;

  switch (viewName) {
    case 'home':
      elements.homeView.classList.add('active');
      refreshIdeaList();
      break;
    case 'edit':
      elements.editView.classList.add('active');
      break;
    case 'detail':
      elements.detailView.classList.add('active');
      break;
  }
}

// 아이디어 목록 새로고침
function refreshIdeaList() {
  const ideas = getIdeas();
  renderIdeaList(ideas, elements.ideaList);
}

// 수정 화면 표시
function showEditView() {
  showView('edit');

  if (state.editingIdeaId) {
    // 기존 아이디어 수정
    const idea = getIdea(state.editingIdeaId);
    if (idea) {
      document.getElementById('edit-title').textContent = '아이디어 수정';
      document.getElementById('idea-title').value = idea.title;
      document.getElementById('idea-content').value = idea.content;
      document.getElementById('idea-tags').value = idea.tags ? idea.tags.join(', ') : '';
    }
  } else {
    // 새 아이디어 작성
    document.getElementById('edit-title').textContent = '새 아이디어 작성';
    elements.ideaForm.reset();
  }
}

// 상세 화면 표시
function showDetailView(ideaId) {
  state.currentIdeaId = ideaId;
  showView('detail');

  const idea = getIdea(ideaId);
  renderIdeaDetail(idea, elements.ideaDetail);

  // 연결 로드
  loadConnections(ideaId);
}

// 연결 로드
function loadConnections(ideaId) {
  const connections = getConnections(ideaId);

  if (connections.length > 0) {
    hideEmptyState(elements.emptyState);
    renderConnectionCards(connections, elements.connectionsContainer);
  } else {
    showEmptyState(elements.emptyState);
    elements.connectionsContainer.innerHTML = '';
  }
}

// 폼 제출 처리
async function handleFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('idea-title').value.trim();
  const content = document.getElementById('idea-content').value.trim();
  const tagsInput = document.getElementById('idea-tags').value.trim();
  const tags = parseTags(tagsInput);

  const ideaData = { title, content, tags };

  // 유효성 검사
  const errors = validateIdea(ideaData);
  if (errors.length > 0) {
    alert('입력 오류:\n' + errors.join('\n'));
    return;
  }

  if (state.editingIdeaId) {
    // 수정
    updateIdea(state.editingIdeaId, ideaData);
    showDetailView(state.editingIdeaId);
  } else {
    // 새로 추가
    const newIdea = addIdea(ideaData);
    showDetailView(newIdea.id);
  }
}

// 연결 찾기 처리
async function handleFindConnections() {
  console.log('🔍 연결 찾기 시작');
  const ideaId = state.currentIdeaId;
  console.log('현재 아이디어 ID:', ideaId);

  if (!ideaId) {
    console.error('아이디어 ID가 없습니다');
    return;
  }

  // 버튼 비활성화
  elements.findConnectionsBtn.disabled = true;
  elements.findConnectionsBtn.textContent = '🔍 검색 중...';

  // 로딩 표시
  hideEmptyState(elements.emptyState);
  elements.connectionsContainer.innerHTML = '';
  showLoading(elements.loadingIndicator);

  try {
    console.log('findConnectionsForIdea 호출 중...');
    // 연결 찾기 (Mock API)
    const connections = await findConnectionsForIdea(ideaId);
    console.log('찾은 연결 수:', connections.length);

    // 결과 저장
    if (connections.length > 0) {
      saveConnections(ideaId, connections);
    }

    // 로딩 숨김
    hideLoading(elements.loadingIndicator);

    // 결과 표시
    if (connections.length > 0) {
      renderConnectionCards(connections, elements.connectionsContainer);

      // 결과 영역으로 스크롤
      setTimeout(() => {
        elements.connectionsContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    } else {
      showEmptyState(elements.emptyState);
      alert('관련된 내용을 찾지 못했습니다. 😔');
    }
  } catch (error) {
    console.error('연결 찾기 오류:', error);
    hideLoading(elements.loadingIndicator);
    alert('연결을 찾는 중 오류가 발생했습니다.');
  } finally {
    // 버튼 복원
    elements.findConnectionsBtn.disabled = false;
    elements.findConnectionsBtn.textContent = '🔍 연결 찾기';
  }
}

// 아이디어 삭제 처리
function handleDeleteIdea(ideaId) {
  deleteIdea(ideaId);

  // 현재 상세 화면이면 홈으로
  if (state.currentView === 'detail' && state.currentIdeaId === ideaId) {
    showView('home');
  } else {
    refreshIdeaList();
  }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', init);
