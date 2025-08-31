// Minimal, safe Markdown to HTML renderer (no raw HTML allowed)
// Supports: headings, bold, italic, code blocks, inline code, links, lists, paragraphs

function escapeHtml(html: string) {
   return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function sanitizeUrl(url: string) {
   try {
      const u = new URL(url, 'http://example.com');
      const proto = (u.protocol || '').toLowerCase();
      if (proto === 'http:' || proto === 'https:' || proto === 'mailto:') {
         return url;
      }
   } catch {}
   return '#';
}

export function markdownToHtml(markdown: string): string {
   if (!markdown) return '';
   let src = escapeHtml(markdown);

   // Code blocks: ```code```
   src = src.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);

   // Headings
   src = src.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
   src = src.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
   src = src.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
   src = src.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
   src = src.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
   src = src.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

   // Bold then italic
   src = src.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
   src = src.replace(/(^|[^*])\*(?!\s)(.+?)(?!\s)\*(?!\*)/g, '$1<em>$2</em>');
   src = src.replace(/(^|[^_])_(?!\s)(.+?)(?!\s)_(?!_)/g, '$1<em>$2</em>');

   // Inline code
   src = src.replace(/`([^`]+)`/g, '<code>$1</code>');

   // Links [text](url)
   src = src.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
      const safe = sanitizeUrl(url);
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${text}</a>`;
   });

   // Unordered lists
   src = src.replace(/(?:^|\n)(-\s+.+)(?:\n(?:-\s+.+))*/g, (block) => {
      const items = block
         .trim()
         .split(/\n/)
         .map((line) => line.replace(/^-\s+/, '').trim())
         .filter(Boolean)
         .map((li) => `<li>${li}</li>`)
         .join('');
      return items ? `<ul>${items}</ul>` : block;
   });

   // Ordered lists
   src = src.replace(/(?:^|\n)((?:\d+\.\s+.+)(?:\n\d+\.\s+.+)*)/g, (block) => {
      const items = block
         .trim()
         .split(/\n/)
         .map((line) => line.replace(/^\d+\.\s+/, '').trim())
         .filter(Boolean)
         .map((li) => `<li>${li}</li>`)
         .join('');
      return items ? `<ol>${items}</ol>` : block;
   });

   // Paragraphs (split on double newlines, wrap non-block elements)
   const blocks = src.split(/\n{2,}/).map((chunk) => chunk.trim());
   const html = blocks
      .map((block) => {
         if (!block) return '';
         if (/^(<h\d|<ul>|<ol>|<pre>|<blockquote>|<p>|<table>|<img|<code>)/.test(block)) {
            return block;
         }
         return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
      })
      .join('\n');

   return html;
}
