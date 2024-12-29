import { create } from "zustand";

export const useStore = create((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));
