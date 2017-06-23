import test from 'ava'

import vm from 'vm'
import fs from 'fs'
import pify from 'pify'
import { join } from 'path'
import { transformFile } from 'babel-core'

transform = pify(transformFile)
{ readFile, writeFile } = pify(fs)

trim = str => str.replace(/^\s+|\s+$/, '')
normalizeLinebreaks = str => str.replace(/\r\n/g, '\n')

maybeWriteFile (toPath, data) ->
  if !('TRAVIS' in process.env) and !('CI' in process.env):
    writeFile(toPath, data).catch(e => {})

getOptionsFile (atPath) ->
  try:
    require(atPath)
  catch e:
    if e.code == 'MODULE_NOT_FOUND':
      return {}

getExpected (atPath) ->
  readFile(atPath, 'utf8')
    .catch(e => if e.code != 'ENOENT': throw e)

parseError (error) ->
  error.message
    .split('.js: ', 2)[1]
    .split('\n', 1)[0]

handleFailure (filePath, error, options) ->
  thrown = error~parseError()
  if options.throws and options.throws != thrown:
    return {
      thrown,
      type: 'fail'
      message:
        `Unexpected failure in '${filePath}' ::\n` +
        `  Expected : ${options.throws}\n` +
        `  Received : ${thrown}`
    }

  return {
    thrown,
    type: 'pass'
    message: `'${filePath}' failed as expected. :: ${thrown}`
  }

fixturesDir = join(__dirname, 'fixtures')

createTests (testFiles) ->
  testFiles.map(filePath =>
    testPath = join(fixturesDir, filePath)
    optionsPath = join(testPath, 'options.json')
    actualPath = join(testPath, 'actual.js')
    expectedPath = join(testPath, 'expected.js')
    options = getOptionsFile(optionsPath)

    if filePath.startsWith('fail'):
      return {
        name: filePath
        runner: t =/>
          t.plan(2)

          error <- t.throws(
            transform(actualPath, {
              babelrc: false
              plugins: [require('..')]
            })
          )

          { type, message, thrown } = handleFailure(filePath, error, options)

          if type == 'fail' and !options.throws:
            data = JSON.stringify({ ...options, thrown }, null, 2)
            <- maybeWriteFile(optionsPath, data)

          t[type](message)
      }

    return {
      name: filePath
      runner: t =/>
        t.plan(1)

        let code = ''

        try:
          now { code } <- transform(actualPath, {
            babelrc: false
            plugins: [require('..')]
          })
        catch e:
          thrown = parseError(e)
          return t.fail(`Unexpected failure in '${filePath}' :: ${thrown}`)

        let expected <- getExpected(expectedPath)
        if !expected:
          <- maybeWriteFile(expectedPath, code)
          now expected = code

        t.is(
          code~trim()~normalizeLinebreaks(),
          expected~trim()~normalizeLinebreaks()
        )
    }
  )

fixturesDir
  ~fs.readdirSync()
  ~createTests()
  .map(({ name, runner }) => test(name, runner))
