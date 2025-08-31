'use client';

import { Email } from '@/mock-data/emails';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { getEmailIcon } from '../../../lib/email-utils';

interface EmailLineProps {
   email: Email;
   layoutId?: boolean;
   isSelected?: boolean;
   onClick?: () => void;
   showId?: boolean;
}

export default function EmailLine({
   email,
   layoutId = false,
   isSelected = false,
   onClick,
   showId = true,
}: EmailLineProps) {
   return (
      <motion.div
         {...(layoutId && { layoutId: `email-line-${email.id}` })}
         onClick={onClick}
         className="w-full px-0.75 py-0.25"
      >
         <div
            className={cn(
               'w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sidebar/80 dark:hover:bg-sidebar/50 transition-colors cursor-pointer rounded-lg',
               isSelected && 'bg-accent/80 dark:bg-accent/50'
            )}
         >
            <div className="relative flex-shrink-0">
               <Avatar className="size-8">
                  <AvatarImage src={email.user.avatarUrl} alt={email.user.name} />
                  <AvatarFallback className="text-xs">
                     {email.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                  </AvatarFallback>
               </Avatar>

               <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-accent border-2 border-background flex items-center justify-center">
                  {getEmailIcon(email.type, 'size-3')}
               </div>
            </div>

            <div className="w-full">
               <div className="flex items-center gap-1.5">
                  {!email.read && <div className="size-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  {showId && (
                     <span
                        className={cn(
                           'text-sm font-medium text-muted-foreground shrink-0',
                           email.read && 'opacity-50'
                        )}
                     >
                        {email.identifier}
                     </span>
                  )}

                  <h4
                     className={cn(
                        'text-sm font-medium text-foreground line-clamp-1 flex-grow',
                        email.read && 'opacity-50'
                     )}
                  >
                     {email.title}
                  </h4>
               </div>

               <div
                  className={cn(
                     'flex items-center justify-between gap-1.5 transition-opacity duration-200',
                     email.read && 'opacity-50'
                  )}
               >
                  <p className="text-sm text-muted-foreground line-clamp-1">{email.content}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{email.timestamp}</span>
               </div>
            </div>
         </div>
      </motion.div>
   );
}
