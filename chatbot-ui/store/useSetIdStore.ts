// store/useStore.ts
import { create } from 'zustand';

interface State {
  setId: number | null;
  updateSetId: (id: number) => void;
  clearState: () => void;
}

export const useSetIdStore = create<State>((set) => ({
  setId: null,
  updateSetId: (id) => set({ setId: id }),
  clearState: () => set({ setId: null }),
}));
