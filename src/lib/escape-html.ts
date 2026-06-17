export function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function escapeHtmlWithEm(s: string): string {
  return escapeHtml(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
}
