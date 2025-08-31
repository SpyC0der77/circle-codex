import { Email, emails as mockEmails, EmailType } from '@/mock-data/emails';
import { labels as allLabels } from '@/mock-data/labels';
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
   // Labels
   toggleLabel: (emailId: string, labelId: string) => void;

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

   // Labels
   toggleLabel: (emailId: string, labelId: string) => {
      set((state) => {
         const update = (e: Email) => {
            const has = e.labels.some((l) => l.id === labelId);
            const labelObj = allLabels.find((l) => l.id === labelId);
            const labels = has
               ? e.labels.filter((l) => l.id !== labelId)
               : labelObj
                 ? [...e.labels, labelObj]
                 : e.labels;
            return { ...e, labels };
         };
         return {
            emails: state.emails.map((e) => (e.id === emailId ? update(e) : e)),
            selectedEmail:
               state.selectedEmail && state.selectedEmail.id === emailId
                  ? update(state.selectedEmail)
                  : state.selectedEmail,
         };
      });
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
