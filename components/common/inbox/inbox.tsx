'use client';

import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useEmailsStore } from '@/store/emails-store';
import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuLabel,
   DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
   MoreHorizontal,
   SlidersHorizontal,
   Trash2,
   CheckCheck,
   Archive,
   ArrowUpDown,
} from 'lucide-react';
import EmailPreview from './email-preview';
import EmailLine from './email-line';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useFilterStore } from '@/store/filter-store';

export default function Inbox() {
   const { emails, selectedEmail, setSelectedEmail, markAsRead, markAllAsRead, getUnreadEmails } =
      useEmailsStore();
   const { filters } = useFilterStore();

   const [showRead, setShowRead] = useState(true);
   const [showSnoozed, setShowSnoozed] = useState(false);
   const [showUnreadFirst, setShowUnreadFirst] = useState(false);
   const [ordering, setOrdering] = useState('newest');
   const [showId, setShowId] = useState(true);
   // Removed status icon in emails; no toggle needed.

   // Filter and sort emails based on settings
   const filteredEmails = emails
      .filter((email) => {
         if (!showRead && email.read) return false;
         if (filters.labels.length > 0) {
            const emailLabelIds = new Set(email.labels.map((l) => l.id));
            const hasAny = filters.labels.some((id) => emailLabelIds.has(id));
            if (!hasAny) return false;
         }
         // Add snoozed filter logic here when implemented
         return true;
      })
      .sort((a, b) => {
         if (showUnreadFirst) {
            if (!a.read && b.read) return -1;
            if (a.read && !b.read) return 1;
         }
         // Sort by timestamp (newest first by default)
         return ordering === 'newest'
            ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });

   const handleDeleteAllEmails = () => {
      console.log('Delete all emails');
   };

   const handleDeleteReadEmails = () => {
      console.log('Delete read emails');
   };

   const handleDeleteCompletedConversations = () => {
      console.log('Delete emails for completed conversations');
   };

   return (
      <ResizablePanelGroup
         direction="horizontal"
         autoSaveId="inbox-panel-group"
         className="w-full h-full"
      >
         <ResizablePanel defaultSize={350} maxSize={500}>
            <div className="flex items-center justify-between px-4 h-10 border-b border-border">
               <div className="flex items-center gap-2">
                  <SidebarTrigger className="inline-flex lg:hidden" />
                  <h2 className="text-lg font-semibold">Inbox</h2>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="xs">
                           <MoreHorizontal className="w-4 h-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={handleDeleteAllEmails}>
                           <Trash2 className="w-4 h-4 mr-2" />
                           Delete all emails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteReadEmails}>
                           <CheckCheck className="w-4 h-4 mr-2" />
                           Delete all read emails
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteCompletedConversations}>
                           <Archive className="w-4 h-4 mr-2" />
                           Delete emails for completed conversations
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <div className="flex items-center gap-2">
                  <Button
                     variant="ghost"
                     size="xs"
                     onClick={markAllAsRead}
                     disabled={getUnreadEmails().length === 0}
                  >
                     <CheckCheck className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="xs">
                           <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel className="flex items-center gap-2">
                           <ArrowUpDown className="w-4 h-4" />
                           Ordering
                        </DropdownMenuLabel>
                        <DropdownMenuCheckboxItem
                           checked={ordering === 'newest'}
                           onCheckedChange={() => setOrdering('newest')}
                        >
                           Newest
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                           checked={ordering === 'oldest'}
                           onCheckedChange={() => setOrdering('oldest')}
                        >
                           Oldest
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuSeparator />

                        <div className="p-2 space-y-3">
                           <div className="flex items-center justify-between">
                              <Label htmlFor="show-snoozed" className="text-sm">
                                 Show snoozed
                              </Label>
                              <Switch
                                 id="show-snoozed"
                                 checked={showSnoozed}
                                 onCheckedChange={setShowSnoozed}
                              />
                           </div>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="show-read" className="text-sm">
                                 Show read
                              </Label>
                              <Switch
                                 id="show-read"
                                 checked={showRead}
                                 onCheckedChange={setShowRead}
                              />
                           </div>
                           <div className="flex items-center justify-between">
                              <Label htmlFor="show-unread-first" className="text-sm">
                                 Show unread first
                              </Label>
                              <Switch
                                 id="show-unread-first"
                                 checked={showUnreadFirst}
                                 onCheckedChange={setShowUnreadFirst}
                              />
                           </div>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Display properties</DropdownMenuLabel>
                        <div className="p-2 space-y-3">
                           <div className="flex items-center justify-between">
                              <Label htmlFor="show-id" className="text-sm">
                                 Message ID
                              </Label>
                              <Switch id="show-id" checked={showId} onCheckedChange={setShowId} />
                           </div>
                        </div>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            <div className="w-full flex flex-col items-center justify-start overflow-y-scroll h-[calc(100%-40px)] pb-0.25">
               {filteredEmails.map((email) => (
                  <EmailLine
                     key={email.id}
                     email={email}
                     isSelected={selectedEmail?.id === email.id}
                     onClick={() => setSelectedEmail(email)}
                     showId={showId}
                  />
               ))}
            </div>
         </ResizablePanel>
         <ResizableHandle withHandle />
         <ResizablePanel defaultSize={350} maxSize={500}>
            <EmailPreview email={selectedEmail} onMarkAsRead={markAsRead} />
         </ResizablePanel>
      </ResizablePanelGroup>
   );
}
