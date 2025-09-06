'use client';

import {
   SidebarGroup,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useFilterStore } from '@/store/filter-store';
import { labels } from '@/mock-data/labels';
import { Tag } from 'lucide-react';

export function NavTags() {
   const { filters, setFilter } = useFilterStore();
   const active = new Set(filters.labels);

   return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
         <SidebarGroupLabel>Tags</SidebarGroupLabel>
         <SidebarMenu>
            {labels.map((label) => (
               <SidebarMenuItem key={label.id}>
                  <SidebarMenuButton
                     className={
                        active.has(label.id)
                           ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                           : ''
                     }
                     onClick={() => {
                        if (active.has(label.id)) {
                           setFilter('labels', []); // clicking active clears selection
                        } else {
                           setFilter('labels', [label.id]); // single-select
                        }
                     }}
                  >
                     <Tag />
                     <span>{label.name}</span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
         </SidebarMenu>
      </SidebarGroup>
   );
}
