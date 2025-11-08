import { create } from 'zustand';
import { Idea, IdeaType } from '../types/idea';
import { Memo } from '../types/memo';
import * as ideaQueries from '../db/queries/ideaQueries';
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
      await ideaQueries.updateIdeaFeedback(ideaId, feedback);

      set(state => ({
        ideas: state.ideas.map(idea =>
          idea.id === ideaId ? { ...idea, userFeedback: feedback } : idea
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
