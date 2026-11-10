export const VERSION = '1.0.0'

export const VARIANTS = ['info', 'success', 'warning']
const DEFAULT_VARIANT = 'info'

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

export function mountBanner(el, { message = '', variant = DEFAULT_VARIANT, dismissible = true } = {}) {
  if (!el) throw new TypeError('mountBanner: target element is required')

  // Unknown variants fall back instead of producing an unstyled class name.
  const safeVariant = VARIANTS.includes(variant) ? variant : DEFAULT_VARIANT

  el.innerHTML = `
    <div class="mb mb--${safeVariant}" role="status">
      <span class="mb__text">${escapeHtml(message)}</span>
      ${dismissible ? '<button class="mb__close" type="button" aria-label="Затвори">×</button>' : ''}
    </div>
    <small class="mb__version">module-banner v${VERSION}</small>`

  const banner = el.querySelector('.mb')
  el.querySelector('.mb__close')?.addEventListener('click', () => banner.remove())

  return banner
}
