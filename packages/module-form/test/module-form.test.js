import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { mountForm, VERSION } from '../index.js'

function setup(options) {
  const { window } = new JSDOM('<div id="root"></div>')
  const root = window.document.getElementById('root')
  mountForm(root, options)
  return { window, root, form: root.querySelector('form') }
}

function submit({ window, form }, { name, email }) {
  form.elements.name.value = name
  form.elements.email.value = email
  form.dispatchEvent(new window.Event('submit', { cancelable: true }))
}

describe('mountForm', () => {
  let ctx
  beforeEach(() => {
    ctx = setup({ title: '<b>Заглавие</b>', buttonText: 'Прати' })
  })

  it('should render title (escaped), fields and button', () => {
    assert.equal(ctx.root.querySelector('.mf__title').textContent, '<b>Заглавие</b>')
    assert.ok(ctx.form.elements.name)
    assert.ok(ctx.form.elements.email)
    assert.equal(ctx.root.querySelector('.mf__button').textContent, 'Прати')
  })

  it('should show an error for an invalid email', () => {
    submit(ctx, { name: 'Иван', email: 'ivan.example.com' })
    const error = ctx.root.querySelector('.mf__error')
    assert.equal(error.hidden, false)
    assert.equal(ctx.root.querySelector('.mf__success').hidden, true)
  })

  it('should reject an email without a domain dot (a@b)', () => {
    submit(ctx, { name: 'Иван', email: 'a@b' })
    assert.equal(ctx.root.querySelector('.mf__error').hidden, false)
    assert.equal(ctx.root.querySelector('.mf__success').hidden, true)
  })

  it('should thank the user and call onSubmit for a valid email', () => {
    const calls = []
    const local = setup({ onSubmit: (data) => calls.push(data) })
    submit(local, { name: 'Иван', email: 'ivan@example.com' })
    const success = local.root.querySelector('.mf__success')
    assert.equal(success.hidden, false)
    assert.match(success.textContent, /Благодарим/)
    assert.deepEqual(calls, [{ name: 'Иван', email: 'ivan@example.com' }])
  })

  it('should show the module version', () => {
    assert.equal(ctx.root.querySelector('.mf__version').textContent, `module-form v${VERSION}`)
  })
})
