'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered, Code } from 'lucide-react';

interface RichTextEditorProps {
   value: string;
   onChange: (html: string) => void;
   placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
   const ref = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (ref.current && ref.current.innerHTML !== value) {
         ref.current.innerHTML = value || '';
      }
   }, [value]);

   const exec = (command: string, value?: string) => {
      document.execCommand(command, false, value);
      ref.current?.focus();
   };

   const wrapSelectionWith = (tag: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const span = document.createElement(tag);
      span.appendChild(range.extractContents());
      range.insertNode(span);
      // move cursor to end of inserted tag
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      ref.current?.focus();
   };

   const createLink = () => {
      const url = prompt('Enter URL (https://...)');
      if (!url) return;
      exec('createLink', url);
   };

   return (
      <div className="w-full border rounded-lg">
         <div className="flex items-center gap-1 p-1 border-b bg-muted/30">
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => exec('bold')}
            >
               <Bold className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => exec('italic')}
            >
               <Italic className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => exec('underline')}
            >
               <Underline className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => wrapSelectionWith('code')}
            >
               <Code className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => exec('insertUnorderedList')}
            >
               <List className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={() => exec('insertOrderedList')}
            >
               <ListOrdered className="h-3.5 w-3.5" />
            </Button>
            <Button
               type="button"
               size="icon"
               variant="ghost"
               className="h-7 w-7"
               onClick={createLink}
            >
               <LinkIcon className="h-3.5 w-3.5" />
            </Button>
         </div>

         <div
            ref={ref}
            role="textbox"
            aria-multiline
            contentEditable
            suppressContentEditableWarning
            className="w-full px-3 py-2 min-h-24 text-sm focus:outline-none"
            onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
         />
      </div>
   );
}
