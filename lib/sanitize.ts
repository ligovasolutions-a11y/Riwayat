import sanitizeHtml from 'sanitize-html';

/*
 * Two tiers for admin-submitted content:
 *  - plainText: strips ALL markup (headings, prices, labels, etc.)
 *  - richText:  a small whitelist (em/strong/br/p/a[href]) for the
 *               handful of fields that use inline emphasis, paragraphs,
 *               or links — e.g. blog post bodies.
 * React already escapes plain string interpolation, so this is defense
 * in depth against stored XSS, not the only line of defense. Content
 * that must render as literal HTML (blog bodies, hero heading with
 * <em>) is rendered via dangerouslySetInnerHTML only AFTER passing
 * through one of these sanitizers — never on raw user input directly.
 */
export function plainText(value: unknown, maxLen = 2000): string {
  if (value === null || value === undefined) return '';
  const stripped = sanitizeHtml(String(value), { allowedTags: [], allowedAttributes: {} });
  return stripped.trim().slice(0, maxLen);
}

export function richTextInline(value: unknown, maxLen = 4000): string {
  if (value === null || value === undefined) return '';
  const clean = sanitizeHtml(String(value), {
    allowedTags: ['em', 'strong', 'br'],
    allowedAttributes: {},
    selfClosing: ['br'],
  });
  return clean.trim().slice(0, maxLen);
}

/* For blog post bodies: paragraphs, emphasis, links, lists, line breaks. */
export function richTextBlock(value: unknown, maxLen = 50000): string {
  if (value === null || value === undefined) return '';
  const clean = sanitizeHtml(String(value), {
    allowedTags: ['p', 'br', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
    allowedAttributes: { a: ['href', 'rel', 'target'] },
    allowedSchemes: ['https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
  return clean.trim().slice(0, maxLen);
}

/* Only allow relative site links, https:// links, or a bare "#"
   placeholder — blocks javascript:, data:, and similar URI-based XSS
   vectors from being injected through admin-editable link fields. */
export function safeHref(value: unknown): string {
  const v = plainText(value, 300);
  if (!v || v === '#') return '#';
  if (/^\/(?!\/)/.test(v)) return v; // starts with a single "/"
  if (/^https:\/\//i.test(v)) return v;
  return '#';
}

/* Safe to embed inside <script type="application/ld+json"> via
   dangerouslySetInnerHTML. JSON.stringify does not escape "<", so a
   text field legitimately containing the literal string "</script>"
   could otherwise break out of the script tag — escaping "<" as its
   unicode form neutralizes that without changing the parsed JSON value. */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function slugify(value: string): string {
  return plainText(value, 200)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 100);
}
