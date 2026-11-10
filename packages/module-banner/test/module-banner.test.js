import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { mountBanner, VERSION } from '../index.js'

function setup(options) {
  const { window } = new JSDOM('<div id="root"></div>')
  const root = window.document.getElementById('root')
  const banner = mountBanner(root, options)
  return { window, root, banner }
}

describe('mountBanner', () => {
  it('should render the message escaped', () => {
    const { root } = setup({ message: '<b>Внимание</b>' })
    assert.equal(root.querySelector('.mb__text').textContent, '<b>Внимание</b>')
    assert.equal(root.querySelector('.mb__text b'), null)
  })

  it('should apply the variant class', () => {
    const { banner } = setup({ message: 'ok', variant: 'success' })
    assert.ok(banner.classList.contains('mb--success'))
  })

  it('should fall back to info for an unknown variant', () => {
    const { banner } = setup({ message: 'x', variant: 'nope' })
    assert.ok(banner.classList.contains('mb--info'))
  })

  it('should remove the banner when dismissed', () => {
    const { window, root } = setup({ message: 'x' })
    root.querySelector('.mb__close').dispatchEvent(new window.Event('click'))
    assert.equal(root.querySelector('.mb'), null)
  })

  it('should not render a close button when not dismissible', () => {
    const { root } = setup({ message: 'x', dismissible: false })
    assert.equal(root.querySelector('.mb__close'), null)
  })

  it('should show the module version', () => {
    const { root } = setup({ message: 'x' })
    assert.equal(root.querySelector('.mb__version').textContent, `module-banner v${VERSION}`)
  })
})
