import { Email, emails as mockEmails, EmailType } from '@/mock-data/emails';
import { create } from 'zustand';

interface EmailsState {
   // Data
   emails: Email[];
   selectedEmail: Email | undefined;

   // Actions
   setSelectedEmail: (email: Email | undefined) => void;
   markAsRead: (id: string) => void;
   markAllAsRead: () => void;
   markAsUnread: (id: string) => void;

   // Filters
   getUnreadEmails: () => Email[];
   getReadEmails: () => Email[];
   getEmailsByType: (type: EmailType) => Email[];
   getEmailsByUser: (userId: string) => Email[];

   // Utility functions
   getEmailById: (id: string) => Email | undefined;
   getUnreadCount: () => number;
}

export const useEmailsStore = create<EmailsState>((set, get) => ({
   // Initial state
   emails: mockEmails,
   selectedEmail: undefined,

   // Actions
   setSelectedEmail: (email: Email | undefined) => {
      set({ selectedEmail: email });
   },

   markAsRead: (id: string) => {
      set((state) => ({
         emails: state.emails.map((email) => (email.id === id ? { ...email, read: true } : email)),
         selectedEmail:
            state.selectedEmail?.id === id
               ? { ...state.selectedEmail, read: true }
               : state.selectedEmail,
      }));
   },

   markAllAsRead: () => {
      set((state) => ({
         emails: state.emails.map((email) => ({ ...email, read: true })),
         selectedEmail: state.selectedEmail ? { ...state.selectedEmail, read: true } : undefined,
      }));
   },

   markAsUnread: (id: string) => {
      set((state) => ({
         emails: state.emails.map((email) => (email.id === id ? { ...email, read: false } : email)),
         selectedEmail:
            state.selectedEmail?.id === id
               ? { ...state.selectedEmail, read: false }
               : state.selectedEmail,
      }));
   },

   // Filters
   getUnreadEmails: () => {
      return get().emails.filter((email) => !email.read);
   },

   getReadEmails: () => {
      return get().emails.filter((email) => email.read);
   },

   getEmailsByType: (type: EmailType) => {
      return get().emails.filter((email) => email.type === type);
   },

   getEmailsByUser: (userId: string) => {
      return get().emails.filter((email) => email.user.id === userId);
   },

   // Utility functions
   getEmailById: (id: string) => {
      return get().emails.find((email) => email.id === id);
   },

   getUnreadCount: () => {
      return get().emails.filter((email) => !email.read).length;
   },
}));
