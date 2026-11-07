/**
 * Minimal, dependency-free markdown renderer for the case-study bodies.
 * Handles exactly the subset used in `app/data/caseStudyBodies.ts`:
 * headings, paragraphs, fenced code blocks, inline code, bold, lists, and links.
 * HTML is escaped first, so it is safe to use with v-html on static content.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(s: string): string {
  // inline code first (so backticks inside bold/code don't clash)
  let out = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
  out = out.replace(/\*\*([^*]+)\*\*/g, (_, b) => `<strong>${b}</strong>`)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, href) => `<a href="${href}" rel="noopener noreferrer">${t}</a>`)
  return out
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing fence
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : ''
      html.push(`<pre><code${cls}>${escapeHtml(code.join('\n'))}</code></pre>`)
      continue
    }

    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    // Headings
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (h) {
      const level = h[1].length
      html.push(`<h${level}>${inline(escapeHtml(h[2]))}</h${level}>`)
      i++
      continue
    }

    // Unordered list items
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(escapeHtml(lines[i].trim().replace(/^[-*]\s+/, '')))}</li>`)
        i++
      }
      html.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Paragraph (collect until blank / heading / list / fence)
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^(#{1,4})\s+/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim())
    ) {
      para.push(lines[i])
      i++
    }
    html.push(`<p>${inline(escapeHtml(para.join(' ')))}</p>`)
  }

  return html.join('\n')
}
