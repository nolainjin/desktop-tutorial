import { create } from 'zustand';
import { Idea, IdeaType } from '../types/idea';
import { Memo } from '../types/memo';
import * as ideaQueries from '../db/queries/ideaQueries';
import * as connectionQueries from '../db/queries/connectionQueries';
import { searchAllSources, validateConnection } from '../features/search/SearchService';

interface IdeaStore {
  ideas: Idea[];
  isSearching: boolean;
  error: string | null;
  selectedTypes: IdeaType[];

  // Actions
  loadIdeas: (memoId: string) => Promise<void>;
  searchIdeas: (memo: Memo) => Promise<void>;
  updateFeedback: (ideaId: string, feedback: 'up' | 'down') => Promise<void>;
  setSelectedTypes: (types: IdeaType[]) => void;
  clearIdeas: () => void;
}

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  isSearching: false,
  error: null,
  selectedTypes: [],

  loadIdeas: async (memoId: string) => {
    try {
      const ideas = await ideaQueries.getIdeasByMemoId(memoId);
      set({ ideas, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  searchIdeas: async (memo: Memo) => {
    set({ isSearching: true, error: null });

    try {
      const { selectedTypes } = get();

      // 기존 아이디어 삭제
      await ideaQueries.deleteIdeasByMemoId(memo.id);

      // 새로운 아이디어 검색
      const ideas = await searchAllSources(memo, selectedTypes);

      // 연결성 검증
      if (!validateConnection(ideas)) {
        console.warn('연결성이 낮아 아이디어가 자동 삭제되었습니다.');
        set({ ideas: [], isSearching: false });
        return;
      }

      // 아이디어 저장
      await ideaQueries.saveIdeas(ideas);

      // 메모의 연결 카운트 업데이트
      await ideaQueries.updateMemoConnectionCount(memo.id);

      set({ ideas, isSearching: false });
    } catch (error) {
      set({ error: (error as Error).message, isSearching: false });
    }
  },

  updateFeedback: async (ideaId: string, feedback: 'up' | 'down') => {
    try {
      // Idea의 feedback 업데이트
      await ideaQueries.updateIdeaFeedback(ideaId, feedback);

      // 현재 아이디어 찾기
      const { ideas } = get();
      const idea = ideas.find(i => i.id === ideaId);

      if (!idea) {
        throw new Error('아이디어를 찾을 수 없습니다.');
      }

      // Connection 처리
      if (feedback === 'up') {
        // "관련있음" - Connection 생성
        await connectionQueries.createConnection(idea.memoId, idea.id, idea.similarity);
      } else {
        // "관련없음" - Connection 삭제
        await connectionQueries.deleteConnection(idea.memoId, idea.id);
      }

      // 메모의 연결 카운트 업데이트
      const connections = await connectionQueries.getConnectionsByMemoId(idea.memoId);
      await ideaQueries.updateMemoConnectionCount(idea.memoId, connections.length);

      // 상태 업데이트
      set(state => ({
        ideas: state.ideas.map(i =>
          i.id === ideaId ? { ...i, userFeedback: feedback } : i
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setSelectedTypes: (types: IdeaType[]) => {
    set({ selectedTypes: types });
  },

  clearIdeas: () => {
    set({ ideas: [], error: null });
  }
}));
