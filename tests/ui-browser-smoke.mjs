// Real, isolated Chromium smoke tests against the generated local production build.
// No production URL, customer records, remote APIs, or screenshots are accessed.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const origin = 'http://127.0.0.1:8766'
const server = spawn('python3', ['-m', 'http.server', '8766', '--bind', '127.0.0.1', '--directory', 'dist'], { stdio: 'ignore' })
let browser
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

try {
  let ready = false
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) throw new Error('Local static server exited')
    try { ready = (await fetch(origin)).ok; if (ready) break } catch {}
    await sleep(250)
  }
  assert.ok(ready, 'Local production build was not served')

  browser = await chromium.launch({ headless: true })
  for (const width of [320, 390, 1280]) {
    for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 860 }, colorScheme })
      await context.route('**/*', route => {
        if (new URL(route.request().url()).origin === origin) return route.continue()
        return route.abort()
      })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))

      await page.goto(origin + '/#view=compare&cmp=M1%2CB2', { waitUntil: 'domcontentloaded' })
      await page.getByRole('combobox', { name: 'First concern' }).waitFor()
      const first = page.getByRole('combobox', { name: 'First concern' })
      const second = page.getByRole('combobox', { name: 'Second concern' })
      assert.equal(await first.inputValue(), 'M1')
      assert.equal(await second.inputValue(), 'B2')
      assert.equal(await page.getByRole('button', { name: 'Compare' }).getAttribute('aria-current'), 'page')

      // Regression: clearing first comparison column must not move second into first.
      await first.selectOption('')
      assert.equal(await first.inputValue(), '')
      assert.equal(await second.inputValue(), 'B2')
      assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('cmp'), ',B2')
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.getByRole('combobox', { name: 'Second concern' }).waitFor()
      assert.equal(await page.getByRole('combobox', { name: 'First concern' }).inputValue(), '')
      assert.equal(await page.getByRole('combobox', { name: 'Second concern' }).inputValue(), 'B2')

      await page.getByRole('button', { name: 'Explore' }).hover()
      await page.getByRole('button', { name: 'Explore' }).click()
      assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('view'), 'explore')
      await page.goBack({ waitUntil: 'domcontentloaded' })
      await page.getByRole('combobox', { name: 'Second concern' }).waitFor()
      assert.equal(new URLSearchParams(new URL(page.url()).hash.slice(1)).get('view'), 'compare')
      assert.equal(await page.getByRole('combobox', { name: 'Second concern' }).inputValue(), 'B2')

      // A user-selected theme must persist without changing existing URL state.
      const toggle = page.getByRole('button', { name: 'Switch to dark theme' })
      await toggle.focus()
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Switch to dark theme')
      await page.keyboard.press('Enter')
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
      await page.reload({ waitUntil: 'domcontentloaded' })
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark')
      assert.equal(await page.evaluate(() => localStorage.getItem('wc-theme')), 'dark')

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 4, 'Horizontal overflow at ' + width + 'px/' + colorScheme + ': ' + overflow)
      assert.deepEqual(errors, [], 'Runtime errors at ' + width + 'px/' + colorScheme)
      await context.close()
      console.log('PASS real Chromium: ' + width + 'px/' + colorScheme + ' comparison/deep-link/Back/hover/keyboard/theme')
    }
  }

  // Error state must be perceivable to assistive technology; no customer data involved.
  const broken = await browser.newContext({ viewport: { width: 390, height: 860 } })
  await broken.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin !== origin) return route.abort()
    if (url.pathname.endsWith('/data.json')) {
      return route.fulfill({ status: 503, contentType: 'text/plain', body: 'Unavailable' })
    }
    return route.continue()
  })
  const errorPage = await broken.newPage()
  await errorPage.goto(origin, { waitUntil: 'domcontentloaded' })
  await errorPage.getByRole('alert').waitFor()
  assert.match(await errorPage.getByRole('alert').textContent(), /Could not load data/)
  await broken.close()
  console.log('PASS real Chromium: data-loading failure announced as alert')
} finally {
  if (browser) await browser.close()
  server.kill('SIGTERM')
}
