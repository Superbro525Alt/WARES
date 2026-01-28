import { create } from "zustand";

interface TeacherModeState {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useTeacherMode = create<TeacherModeState>((set) => ({
  enabled: false,
  toggle: () => set((state) => ({ enabled: !state.enabled })),
  setEnabled: (enabled) => set({ enabled }),
}));
