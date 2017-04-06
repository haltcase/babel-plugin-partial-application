import test from 'ava'

import { join } from 'path'
import { transformFileSync } from 'babel-core'
import { readFileSync, writeFileSync, readdirSync } from 'fs'

const trim = str => str.replace(/^\s+|\s+$/, '')
const normalizeLinebreaks = str => str.replace(new RegExp('\r\n', 'g'), '\n')

const fixturesDir = join(__dirname, 'fixtures')
const testFiles = readdirSync(fixturesDir)

testFiles.forEach(filePath => {
  test(filePath, t => {
    const testPath = join(fixturesDir, filePath)
    const actualPath = join(testPath, 'actual.js')
    const expectedPath = join(testPath, 'expected.js')
    let code = ''

    try {
      code = transformFileSync(actualPath, {
        babelrc: false,
        plugins: [require('..')]
      }).code
    } catch (e) {
      if (filePath.startsWith('fail')) {
        return t.pass(
          `'${filePath}' failed as expected. :: ${e.message}`
        )
      } else {
        return t.fail(
          `Unexpected failure in '${filePath}' :: ${e.message}`
        )
      }
    }

    let expected = ''

    try {
      expected = readFileSync(expectedPath).toString()
    } catch (err) {
      if (err.code === 'ENOENT') {
        expected = code
        writeFileSync(expectedPath, expected)
      } else {
        throw err
      }
    }

    t.is(
      normalizeLinebreaks(trim(code)),
      normalizeLinebreaks(trim(expected))
    )
  })
})