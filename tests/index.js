import test from 'ava'

import { join } from 'path'
import { transformFileSync } from 'babel-core'
import { readFileSync, writeFileSync, readdirSync } from 'fs'

const trim = str => str.replace(/^\s+|\s+$/, '')
const normalizeLinebreaks = str => str.replace(new RegExp('\r\n', 'g'), '\n')

const maybeWriteFile = (toPath, data) => {
  if (!('TRAVIS' in process.env) && !('CI' in process.env)) {
    writeFileSync(toPath, data)
  }
}

const getErrorMessage = error =>
  error.message
    .split('.js: ', 2)[1]
    .split('\n', 1)[0]

const getOptionsFile = atPath => {
  try {
    return require(atPath)
  } catch (e) {}
}

const fixturesDir = join(__dirname, 'fixtures')
const testFiles = readdirSync(fixturesDir)

testFiles.forEach(filePath => {
  test(filePath, t => {
    const testPath = join(fixturesDir, filePath)
    const optionsPath = join(testPath, 'options.json')
    const actualPath = join(testPath, 'actual.js')
    const expectedPath = join(testPath, 'expected.js')
    const options = getOptionsFile(optionsPath)

    let code = ''

    try {
      code = transformFileSync(actualPath, {
        babelrc: false,
        plugins: [require('..')]
      }).code
    } catch (e) {
      const thrown = getErrorMessage(e)
      if (filePath.startsWith('fail')) {
        if (options && options.throws !== thrown) {
          return t.fail(
            `Unexpected failure in '${filePath}' ::\n` +
            `  Expected : ${options.throws}\n` +
            `  Received : ${thrown}`
          )
        }

        const data = JSON.stringify({ throws: thrown }, null, 2)
        maybeWriteFile(optionsPath, data)

        return t.pass(
          `'${filePath}' failed as expected. :: ${thrown}`
        )
      } else {
        return t.fail(
          `Unexpected failure in '${filePath}' :: ${thrown}`
        )
      }
    }

    let expected = ''

    try {
      expected = readFileSync(expectedPath).toString()
    } catch (err) {
      if (err.code === 'ENOENT') {
        expected = code
        maybeWriteFile(expectedPath, expected)
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
