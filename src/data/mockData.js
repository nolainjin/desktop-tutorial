// 초기 아이디어 데이터
export const initialIdeas = [
  {
    id: "1",
    title: "매일 조금씩 성장하기",
    content: "나는 매일 조금씩 성장하고 싶다. 작은 습관들이 쌓여서 큰 변화가 되는 것을 경험하고 싶다. 하루에 1%씩만 발전해도 1년 후면 37배가 된다는 말이 있다. 이것을 실천하고 싶다.",
    createdAt: "2024-01-15",
    tags: ["성장", "습관", "자기계발"]
  },
  {
    id: "2",
    title: "실패를 두려워하지 않기",
    content: "실패는 성공의 어머니라는 말이 있다. 하지만 막상 실패 앞에서는 두렵다. 실패를 배움의 기회로 보고, 더 과감하게 도전하고 싶다.",
    createdAt: "2024-01-16",
    tags: ["도전", "실패", "성장"]
  },
  {
    id: "3",
    title: "진정한 친구의 의미",
    content: "친구가 많은 것보다 진정한 친구 한 명이 더 소중하다고 생각한다. 서로를 이해하고 지지해주는 관계를 만들고 싶다.",
    createdAt: "2024-01-17",
    tags: ["관계", "우정", "인간관계"]
  }
];

// 연결 데이터 (각 아이디어별)
export const mockConnections = {
  "1": [
    {
      id: "c1-1",
      ideaId: "1",
      type: "quote",
      content: "천리길도 한 걸음부터",
      source: {
        author: "노자",
        title: "도덕경",
        year: "기원전 4세기",
        url: null,
        category: "철학",
        platform: null
      },
      similarity: 0.85,
      reasoning: "당신의 '매일 성장' 아이디어와 연결됩니다. 큰 목표도 작은 실천에서 시작된다는 점에서 유사합니다.",
      userFeedback: null
    },
    {
      id: "c1-2",
      ideaId: "1",
      type: "web",
      content: "습관의 힘: 작은 변화가 만드는 놀라운 결과",
      source: {
        author: "Charles Duhigg",
        title: "The Power of Habit",
        year: "2012",
        url: "https://www.amazon.com/Power-Habit-What-Life-Business/dp/081298160X",
        category: "심리학",
        platform: "Amazon"
      },
      similarity: 0.92,
      reasoning: "습관 형성의 과학적 메커니즘을 설명하며, 작은 변화의 누적 효과를 다룹니다. 당신의 '작은 습관이 쌓여 큰 변화가 된다'는 생각과 완벽히 일치합니다.",
      userFeedback: null
    },
    {
      id: "c1-3",
      ideaId: "1",
      type: "movie",
      content: "It's not about how hard you hit. It's about how hard you can get hit and keep moving forward.",
      source: {
        author: "Sylvester Stallone",
        title: "Rocky Balboa",
        year: "2006",
        url: null,
        category: "스포츠 드라마",
        platform: "영화"
      },
      similarity: 0.78,
      reasoning: "지속적인 노력과 회복력의 중요성을 강조합니다. 매일 조금씩 성장하려면 좌절 후에도 계속 나아가야 한다는 점에서 연결됩니다.",
      userFeedback: null
    },
    {
      id: "c1-4",
      ideaId: "1",
      type: "quote",
      content: "우리는 반복적으로 하는 행동의 결과다. 그러므로 탁월함은 행동이 아니라 습관이다.",
      source: {
        author: "아리스토텔레스",
        title: null,
        year: null,
        url: null,
        category: "철학",
        platform: null
      },
      similarity: 0.88,
      reasoning: "습관의 누적 효과를 강조하는 명언입니다. 매일의 작은 실천이 결국 당신을 만든다는 메시지입니다.",
      userFeedback: null
    },
    {
      id: "c1-5",
      ideaId: "1",
      type: "web",
      content: "Atomic Habits - 1% 개선의 놀라운 효과",
      source: {
        author: "James Clear",
        title: "Atomic Habits",
        year: "2018",
        url: "https://jamesclear.com/atomic-habits",
        category: "자기계발",
        platform: "공식 웹사이트"
      },
      similarity: 0.95,
      reasoning: "하루 1% 개선의 복리 효과를 정확히 설명합니다. 당신이 언급한 '1년 후 37배' 개념의 출처입니다.",
      userFeedback: null
    }
  ],
  "2": [
    {
      id: "c2-1",
      ideaId: "2",
      type: "quote",
      content: "실패는 성공의 어머니다.",
      source: {
        author: "토마스 에디슨",
        title: null,
        year: null,
        url: null,
        category: "명언",
        platform: null
      },
      similarity: 0.90,
      reasoning: "실패를 긍정적으로 받아들이는 태도를 강조합니다. 에디슨은 전구를 발명하기 위해 수천 번 실패했다고 합니다.",
      userFeedback: null
    },
    {
      id: "c2-2",
      ideaId: "2",
      type: "movie",
      content: "Our greatest glory is not in never falling, but in rising every time we fall.",
      source: {
        author: "Confucius (영화에서 인용)",
        title: "Batman Begins",
        year: "2005",
        url: null,
        category: "액션",
        platform: "영화"
      },
      similarity: 0.87,
      reasoning: "넘어져도 다시 일어서는 것의 중요성을 말합니다. 실패 후 재도전하는 용기와 연결됩니다.",
      userFeedback: null
    },
    {
      id: "c2-3",
      ideaId: "2",
      type: "web",
      content: "실패에서 배우는 기업들: 성공한 기업의 실패 사례 연구",
      source: {
        author: "Harvard Business Review",
        title: "Learning from Failure",
        year: "2011",
        url: "https://hbr.org/2011/04/strategies-for-learning-from-failure",
        category: "비즈니스",
        platform: "HBR"
      },
      similarity: 0.83,
      reasoning: "실패를 조직의 학습 기회로 활용하는 방법을 다룹니다. 실패를 배움의 기회로 보는 당신의 생각과 일치합니다.",
      userFeedback: null
    },
    {
      id: "c2-4",
      ideaId: "2",
      type: "quote",
      content: "내가 성공할 수 있었던 이유는 단 한 가지, 실패를 받아들였기 때문이다.",
      source: {
        author: "마이클 조던",
        title: null,
        year: null,
        url: null,
        category: "스포츠",
        platform: null
      },
      similarity: 0.89,
      reasoning: "농구 역사상 최고의 선수도 수많은 실패를 경험했습니다. 실패를 두려워하지 않는 태도가 성공의 열쇠라는 메시지입니다.",
      userFeedback: null
    }
  ],
  "3": [
    {
      id: "c3-1",
      ideaId: "3",
      type: "quote",
      content: "진정한 친구란 당신의 과거를 알면서도 미래를 믿어주는 사람이다.",
      source: {
        author: "작자 미상",
        title: null,
        year: null,
        url: null,
        category: "우정",
        platform: null
      },
      similarity: 0.88,
      reasoning: "진정한 친구의 의미를 잘 표현한 명언입니다. 서로를 이해하고 지지한다는 당신의 생각과 일치합니다.",
      userFeedback: null
    },
    {
      id: "c3-2",
      ideaId: "3",
      type: "movie",
      content: "You've got a friend in me.",
      source: {
        author: "Randy Newman",
        title: "Toy Story",
        year: "1995",
        url: null,
        category: "애니메이션",
        platform: "영화"
      },
      similarity: 0.82,
      reasoning: "무조건적인 우정과 지지를 노래한 명곡입니다. 진정한 친구는 항상 곁에 있다는 메시지입니다.",
      userFeedback: null
    },
    {
      id: "c3-3",
      ideaId: "3",
      type: "web",
      content: "The Science of Friendship: What Makes Deep Connections",
      source: {
        author: "Psychology Today",
        title: "The Science of Friendship",
        year: "2020",
        url: "https://www.psychologytoday.com/us/basics/friends",
        category: "심리학",
        platform: "Psychology Today"
      },
      similarity: 0.85,
      reasoning: "깊은 우정을 형성하는 심리학적 요소들을 설명합니다. 양보다 질이 중요하다는 당신의 생각을 뒷받침합니다.",
      userFeedback: null
    }
  ]
};

// LocalStorage 키
const STORAGE_KEYS = {
  IDEAS: 'ideaconnect_ideas',
  CONNECTIONS: 'ideaconnect_connections',
  FEEDBACK: 'ideaconnect_feedback'
};

// 데이터 가져오기
export function getIdeas() {
  const stored = localStorage.getItem(STORAGE_KEYS.IDEAS);
  if (stored) {
    return JSON.parse(stored);
  }
  // 초기 데이터 저장
  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(initialIdeas));
  return initialIdeas;
}

// 아이디어 저장
export function saveIdeas(ideas) {
  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
}

// 단일 아이디어 가져오기
export function getIdea(id) {
  const ideas = getIdeas();
  return ideas.find(idea => idea.id === id);
}

// 아이디어 추가
export function addIdea(idea) {
  const ideas = getIdeas();
  const newIdea = {
    ...idea,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  ideas.unshift(newIdea);
  saveIdeas(ideas);
  return newIdea;
}

// 아이디어 수정
export function updateIdea(id, updates) {
  const ideas = getIdeas();
  const index = ideas.findIndex(idea => idea.id === id);
  if (index !== -1) {
    ideas[index] = { ...ideas[index], ...updates };
    saveIdeas(ideas);
    return ideas[index];
  }
  return null;
}

// 아이디어 삭제
export function deleteIdea(id) {
  const ideas = getIdeas();
  const filtered = ideas.filter(idea => idea.id !== id);
  saveIdeas(filtered);
  // 연결도 삭제
  deleteConnectionsForIdea(id);
}

// 연결 가져오기
export function getConnections(ideaId) {
  const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  let connections = stored ? JSON.parse(stored) : {};

  // 초기 mock 데이터가 없으면 추가
  if (!connections[ideaId] && mockConnections[ideaId]) {
    connections[ideaId] = mockConnections[ideaId];
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }

  return connections[ideaId] || [];
}

// 연결 저장
export function saveConnections(ideaId, connections) {
  const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  const allConnections = stored ? JSON.parse(stored) : {};
  allConnections[ideaId] = connections;
  localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(allConnections));
}

// 연결 찾기 (Mock - 실제로는 API 호출)
export async function findConnectionsForIdea(ideaId) {
  // 로딩 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock 데이터 반환
  if (mockConnections[ideaId]) {
    return mockConnections[ideaId];
  }

  // 새 아이디어의 경우 빈 배열 반환
  return [];
}

// 연결 삭제
export function deleteConnectionsForIdea(ideaId) {
  const stored = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
  if (stored) {
    const connections = JSON.parse(stored);
    delete connections[ideaId];
    localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));
  }
}

// 피드백 저장
export function saveFeedback(connectionId, feedback) {
  const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  const feedbacks = stored ? JSON.parse(stored) : {};
  feedbacks[connectionId] = feedback;
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbacks));
}

// 피드백 가져오기
export function getFeedback(connectionId) {
  const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  if (stored) {
    const feedbacks = JSON.parse(stored);
    return feedbacks[connectionId] || null;
  }
  return null;
}
