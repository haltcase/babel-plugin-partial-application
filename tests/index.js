import test from 'ava'

import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import { transformFileSync } from 'babel-core'

const trim = str => str.replace(/^\s+|\s+$/, '')

const fixturesDir = join(__dirname, 'fixtures')
const testFiles = readdirSync(fixturesDir)

testFiles.forEach(filePath => {
  test(filePath, t => {
    const testPath = join(fixturesDir, filePath)
    const actualPath = join(testPath, 'actual.js')
    const expectedPath = join(testPath, 'expected.js')
    const { code } = transformFileSync(actualPath)

    const expected = readFileSync(expectedPath).toString()

    t.is(trim(code), trim(expected))
  })
})