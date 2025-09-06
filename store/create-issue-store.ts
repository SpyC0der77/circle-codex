import { create } from 'zustand';

interface CreateIssueState {
   isOpen: boolean;
   defaultStatus: string | null;

   // Actions
   openModal: (status?: string) => void;
   closeModal: () => void;
   setDefaultStatus: (status: string | null) => void;
}

export const useCreateIssueStore = create<CreateIssueState>((set) => ({
   // Initial state
   isOpen: false,
   defaultStatus: null,

   // Actions
   openModal: (status) => set({ isOpen: true, defaultStatus: status || null }),
   closeModal: () => set({ isOpen: false }),
   setDefaultStatus: (status) => set({ defaultStatus: status }),
}));
