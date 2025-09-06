'use client';

import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const highlightRef = useRef<HTMLDivElement>(null);

   const highlight = (text: string): string => {
      if (!text) return '';
      return text.replace(/([#*_\-`~>\[\]()])/g, '<span class="text-gray-400">$1</span>');
   };

   useEffect(() => {
      const ta = textareaRef.current;
      const hl = highlightRef.current;
      if (ta) {
         ta.style.height = 'auto';
         ta.style.height = `${Math.max(96, ta.scrollHeight)}px`;
      }
      if (hl) {
         hl.innerHTML = highlight(value);
         hl.style.height = ta ? `${Math.max(96, ta.scrollHeight)}px` : '96px';
      }
   }, [value]);

   return (
      <div className="w-full border rounded-lg">
         <div className="relative min-h-24">
            <Textarea
               ref={textareaRef}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}
               className="absolute inset-0 w-full px-3 py-2 min-h-24 text-sm focus:outline-none resize-none bg-transparent text-transparent placeholder:text-white"
               style={{ caretColor: 'white' }}
            />
            <div
               ref={highlightRef}
               className="absolute inset-0 w-full px-3 py-2 min-h-24 text-sm pointer-events-none whitespace-pre-wrap overflow-hidden text-white"
               style={{ minHeight: '6rem' }}
            />
         </div>
      </div>
   );
}
