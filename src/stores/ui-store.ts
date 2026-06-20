import { create } from "zustand";
import type { RecruiterFilters } from "@/types";

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  recruiterFilters: RecruiterFilters;
  toggleSidebar: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  setRecruiterFilters: (filters: Partial<RecruiterFilters>) => void;
  resetRecruiterFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileMenuOpen: false,
  recruiterFilters: {},

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setRecruiterFilters: (filters) =>
    set((s) => ({ recruiterFilters: { ...s.recruiterFilters, ...filters } })),
  resetRecruiterFilters: () => set({ recruiterFilters: {} }),
}));
