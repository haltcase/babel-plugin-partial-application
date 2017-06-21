import test from 'ava'

import vm from 'vm'
import fs from 'fs'
import pify from 'pify'
import { join } from 'path'
import { transformFile } from 'babel-core'

transform = pify(transformFile)
{ readFile, writeFile, readdir } = pify(fs)

trim = str => str.replace(/^\s+|\s+$/, '')
normalizeLinebreaks = str => str.replace(new RegExp('\r\n', 'g'), '\n')

maybeWriteFile (toPath, data) ->
  if !('TRAVIS' in process.env) and !('CI' in process.env):
    writeFile(toPath, data)

getErrorMessage (error) ->
  error.message
    .split('.js: ', 2)[1]
    .split('\n', 1)[0]

getOptionsFile (atPath) ->
  try:
    require(atPath)
  catch e:
    if e.code == 'MODULE_NOT_FOUND':
      return {}

getExpected (atPath) ->
  readFile(atPath, 'utf8')
    .catch(e => if e.code != 'ENOENT': throw e)

handleFailure (t, filePath, thrown, optionsPath, options) -/>
  if options.throws and options.throws != thrown:
    return t.fail(
      `Unexpected failure in '${filePath}' ::\n` +
      `  Expected : ${options.throws}\n` +
      `  Received : ${thrown}`
    )

  data = JSON.stringify({ ...options, throws: thrown }, null, 2)
  <- maybeWriteFile(optionsPath, data)

  t.pass(`'${filePath}' failed as expected. :: ${thrown}`)

fixturesDir = join(__dirname, 'fixtures')

readdir(fixturesDir).then(testFiles -/>
  <- [
    for elem filePath in testFiles:
      test(filePath, t =/>
        testPath = join(fixturesDir, filePath)
        optionsPath = join(testPath, 'options.json')
        actualPath = join(testPath, 'actual.js')
        expectedPath = join(testPath, 'expected.js')
        options = getOptionsFile(optionsPath)

        let code = ''

        try:
          now { code } <- transform(actualPath, {
            babelrc: false
            plugins: [require('..')]
          })
        catch e:
          thrown = getErrorMessage(e)
          if filePath.startsWith('fail'):
            return handleFailure(t, filePath, thrown, optionsPath, options)

          return t.fail(`Unexpected failure in '${filePath}' :: ${thrown}`)

        expected <- getExpected(expectedPath)
        if !expected: <- maybeWriteFile(expectedPath, code)

        t.is(
          code~trim()~normalizeLinebreaks(),
          expected~trim()~normalizeLinebreaks()
        )
      )
  ]
)
