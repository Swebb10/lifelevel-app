import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
const root = resolve('dist')
const manifest = JSON.parse(await readFile(resolve(root, 'manifest.webmanifest'), 'utf8'))
assert.equal(manifest.display, 'standalone')
assert.equal(manifest.lang, 'es')
assert.ok(manifest.id && manifest.start_url && manifest.scope)
for (const size of ['192x192', '512x512']) assert.ok(manifest.icons.some(icon => icon.sizes === size && icon.purpose === 'any'))
assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'))
for (const icon of [...manifest.icons, { src: 'apple-touch-icon.png', sizes: '180x180' }]) {
  const png = await readFile(resolve(root, icon.src))
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${icon.src} must be a real PNG`)
  assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes)
}
const html = await readFile(resolve(root, 'index.html'), 'utf8')
assert.match(html, /rel="manifest"/)
assert.match(html, /rel="apple-touch-icon"/)
assert.match(html, /registerSW\.js/)
await access(resolve(root, 'registerSW.js'))
const worker = await readFile(resolve(root, 'sw.js'), 'utf8')
for (const file of ['index.html', ...manifest.icons.map(icon => icon.src), 'apple-touch-icon.png']) assert.ok(worker.includes(file), `${file} must be available offline`)
console.log('PWA verificada: manifest, registro, iconos PNG y caché sin conexión correctos.')
