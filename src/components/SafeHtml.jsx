import DOMPurify from 'dompurify';

export function SafeHtml({ html, className = '' }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'td', 'th', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}