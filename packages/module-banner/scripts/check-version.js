// Guards against publishing a package whose runtime VERSION disagrees with package.json.
import { readFile } from 'node:fs/promises'
import { VERSION } from '../index.js'

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

if (packageJson.version !== VERSION) {
  console.error(`Version mismatch: package.json=${packageJson.version}, index.js VERSION=${VERSION}`)
  process.exit(1)
}

console.info(`OK: version ${VERSION}`)
