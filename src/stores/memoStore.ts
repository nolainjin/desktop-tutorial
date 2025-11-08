import { create } from 'zustand';
import { Memo, CreateMemoInput, UpdateMemoInput } from '../types/memo';
import * as memoQueries from '../db/queries/memoQueries';

interface MemoStore {
  memos: Memo[];
  currentMemo: Memo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadMemos: () => Promise<void>;
  getMemo: (id: string) => Promise<void>;
  createMemo: (input: CreateMemoInput) => Promise<Memo>;
  updateMemo: (id: string, input: UpdateMemoInput) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  searchMemos: (query: string) => Promise<void>;
  setCurrentMemo: (memo: Memo | null) => void;
}

export const useMemoStore = create<MemoStore>((set) => ({
  memos: [],
  currentMemo: null,
  isLoading: false,
  error: null,

  loadMemos: async () => {
    set({ isLoading: true, error: null });
    try {
      const memos = await memoQueries.getAllMemos();
      set({ memos, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getMemo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const memo = await memoQueries.getMemoById(id);
      set({ currentMemo: memo || null, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createMemo: async (input: CreateMemoInput) => {
    set({ isLoading: true, error: null });
    try {
      const memo = await memoQueries.createMemo(input);
      set((state) => ({
        memos: [memo, ...state.memos],
        currentMemo: memo,
        isLoading: false,
      }));
      return memo;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateMemo: async (id: string, input: UpdateMemoInput) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await memoQueries.updateMemo(id, input);
      if (updated) {
        set((state) => ({
          memos: state.memos.map((m) => (m.id === id ? updated : m)),
          currentMemo: state.currentMemo?.id === id ? updated : state.currentMemo,
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteMemo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await memoQueries.deleteMemo(id);
      set((state) => ({
        memos: state.memos.filter((m) => m.id !== id),
        currentMemo: state.currentMemo?.id === id ? null : state.currentMemo,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  searchMemos: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const memos = query
        ? await memoQueries.searchMemos(query)
        : await memoQueries.getAllMemos();
      set({ memos, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  setCurrentMemo: (memo: Memo | null) => {
    set({ currentMemo: memo });
  },
}));
