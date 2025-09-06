'use client';

import { Email } from '@/mock-data/emails';
import { useEmailsStore } from '@/store/emails-store';
import { Button } from '@/components/ui/button';
import { Mailbox } from './icons/mailbox';
import { Check, Paperclip, Send, Tag as TagIcon } from 'lucide-react';
import { markdownToHtml } from '@/lib/markdown';
import { useMemo, useState } from 'react';
import { RichTextEditor } from '@/components/common/editor/rich-text-editor';
import { labels } from '@/mock-data/labels';
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuCheckboxItem,
   DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface EmailPreviewProps {
   email?: Email;
   onMarkAsRead?: (id: string) => void;
}

export default function EmailPreview({ email, onMarkAsRead }: EmailPreviewProps) {
   const { getUnreadCount, toggleLabel } = useEmailsStore();
   const [reply, setReply] = useState<string>('');
   // Compute once per content change to keep hooks order stable across renders
   const bodyHtml = useMemo(() => markdownToHtml(email?.content ?? ''), [email?.content]);

   if (!email) {
      const unreadCount = getUnreadCount();
      return (
         <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Mailbox className="w-16 h-16 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
               {unreadCount} unread email{unreadCount !== 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
               Select an email from the list to view its details and take action.
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col h-full">
         <div className="flex items-center justify-between px-4 h-10 border-b border-border">
            <div className="flex items-center gap-3">
               <span className="text-sm font-medium">{email.identifier}</span>
            </div>

            <div className="flex items-center gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="xs" className="gap-1">
                        <TagIcon className="size-4" />
                        Tags
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-56">
                     <DropdownMenuLabel>Apply tags</DropdownMenuLabel>
                     {labels.map((l) => (
                        <DropdownMenuCheckboxItem
                           key={l.id}
                           checked={email.labels.some((x) => x.id === l.id)}
                           onCheckedChange={() => toggleLabel(email.id, l.id)}
                        >
                           {l.name}
                        </DropdownMenuCheckboxItem>
                     ))}
                  </DropdownMenuContent>
               </DropdownMenu>
               {!email.read && onMarkAsRead && (
                  <Button
                     variant="outline"
                     size="xs"
                     onClick={() => onMarkAsRead(email.id)}
                     className="gap-1"
                  >
                     <Check className="size-4" />
                     Mark as read
                  </Button>
               )}
            </div>
         </div>

         <div className="pt-10 pb-6 px-4 space-y-4 w-full max-w-4xl mx-auto">
            <div>
               <h3 className="text-xl font-semibold text-foreground mb-2">{email.title}</h3>
            </div>

            <div className="prose prose-sm max-w-none">
               <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
            </div>

            <div className="relative w-full flex flex-col mt-8">
               <RichTextEditor value={reply} onChange={setReply} placeholder="Write a reply..." />
               <div className="absolute right-3 -bottom-12 flex items-center gap-3">
                  <Button size="icon" variant="ghost" title="Attach a file">
                     <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" title="Send" onClick={() => setReply('')}>
                     <Send className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
