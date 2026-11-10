export const VERSION = '1.0.0'

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

export function isValidEmail(email) {
  return email.includes('@')
}

function renderForm({ title, buttonText }) {
  return `
    <form class="mf" novalidate>
      <h2 class="mf__title">${escapeHtml(title)}</h2>
      <label class="mf__field">
        <span>Име</span>
        <input name="name" type="text" autocomplete="name" required>
      </label>
      <label class="mf__field">
        <span>Имейл</span>
        <input name="email" type="text" inputmode="email" autocomplete="email" required>
      </label>
      <p class="mf__error" role="alert" hidden></p>
      <button class="mf__button" type="submit">${escapeHtml(buttonText)}</button>
      <p class="mf__success" role="status" hidden></p>
      <small class="mf__version">module-form v${VERSION}</small>
    </form>`
}

export function mountForm(el, { title = 'Свържете се с нас', buttonText = 'Изпрати', onSubmit } = {}) {
  if (!el) throw new TypeError('mountForm: target element is required')

  el.innerHTML = renderForm({ title, buttonText })

  const form = el.querySelector('form')
  const error = el.querySelector('.mf__error')
  const success = el.querySelector('.mf__success')

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const name = form.elements.name.value.trim()
    const email = form.elements.email.value.trim()

    if (!isValidEmail(email)) {
      error.textContent = 'Моля, въведете валиден имейл.'
      error.hidden = false
      success.hidden = true
      return
    }

    error.hidden = true
    // textContent (not innerHTML) so user input can never inject markup
    success.textContent = `Благодарим, ${name || 'приятелю'}!`
    success.hidden = false
    onSubmit?.({ name, email })
  })

  return form
}
