import {
   InboxItem as Email,
   inboxItems as emails,
   NotificationType as EmailType,
   filterByReadStatus as _filterByReadStatus,
   filterByType as _filterByType,
   filterByUser as _filterByUser,
   markAsRead as _markAsRead,
   markAllAsRead as _markAllAsRead,
} from './inbox';

export type { EmailType };
export type { Email };
export { emails };

export const filterByReadStatus = _filterByReadStatus as (
   items: Email[],
   isRead: boolean
) => Email[];
export const filterByType = _filterByType as (items: Email[], type: EmailType) => Email[];
export const filterByUser = _filterByUser as (items: Email[], userId: string) => Email[];
export const markAsRead = _markAsRead as (items: Email[], itemId: string) => Email[];
export const markAllAsRead = _markAllAsRead as (items: Email[]) => Email[];
