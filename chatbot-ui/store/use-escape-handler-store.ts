// store/useEscapeHandlerStore.ts
import { create } from 'zustand';

interface EscapeHandlerState {
  onEscapeKeyDown: ((e: KeyboardEvent) => void) | null;
  setOnEscapeKeyDown: (fn: (e: KeyboardEvent) => void) => void;
  clearOnEscapeKeyDown: () => void;
}

export const useEscapeHandlerStore = create<EscapeHandlerState>((set) => ({
  onEscapeKeyDown: null,
  setOnEscapeKeyDown: (fn) => set({ onEscapeKeyDown: fn }),
  clearOnEscapeKeyDown: () => set({ onEscapeKeyDown: null }),
}));
