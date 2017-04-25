/* global ace, _ */

import split from 'split.js'
import { Tour } from 'tether-shepherd'
import debounce from 'lodash.debounce'
import highlight from 'highlight.js/lib/highlight'
import javascript from 'highlight.js/lib/languages/javascript'
import prettyFormat from 'pretty-format'
import { format } from 'prettier'
import { transform } from 'babel-standalone'

import plugin from '../..'
import readme from '../../readme.md'

const getStorage = key => {
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (e) {}
}

const setStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {}
}

const $ = document.querySelector.bind(document)

const helpButton = $('.right .material-icons.help')
const helpModal = $('#help-modal')
const helpModalBody = $('#help-modal .body')
const closeButton = $('#help-modal .close')

helpModalBody.innerHTML = readme
highlight.registerLanguage('javascript', javascript)
highlight.initHighlightingOnLoad()

const getQueryProp = name => {
  const regex = new RegExp(`[?&]${name}=([^&]*)`)
  const match = regex.exec(window.location.search)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

const removeQueryProp = (parameter) => {
  let url = window.location.href

  const parts = url.split('?')
  if (parts.length < 2) return

  const prefix = encodeURIComponent(parameter) + '='
  const props = parts[1].split(/[&;]/g)

  for (let i= props.length; i-- > 0;) {
    if (props[i].lastIndexOf(prefix, 0) !== -1) {
      props.splice(i, 1)
    }
  }

  url = parts[0] + (props.length > 0 ? '?' + props.join('&') : '')
  return url
}

const setModalState = (state) => {
  const isVisible = helpModal.style.visibility === 'visible'

  if (!!isVisible === !!state) return

  if (state) {
    helpModal.style.visibility = 'visible'
    helpModal.classList.add('visible')
  } else {
    const url = removeQueryProp('readme')
    if (window.history.pushState) {
      window.history.pushState('', '', url)
    } else {
      window.location.href = url
    }

    helpModal.classList.remove('visible')

    setTimeout(() => {
      helpModal.style.visibility = 'hidden'
    }, 250)
  }
}

const checkQuery = () => {
  const hasHash = !!window.location.hash
  const hasProp = !!getQueryProp('readme')
  setModalState(hasHash || hasProp)
}
checkQuery()

window.addEventListener('popstate', checkQuery)

helpButton.addEventListener('click', () => setModalState(true))
closeButton.addEventListener('click', () => setModalState(false))

split(['#editor-wrapper', '#output-wrapper'])
split(['#compiled-wrapper', '#console-wrapper'], {
  direction: 'vertical',
  sizes: [85, 15]
})

function loadEditors (state) {
  const [editor, compiled, result] = [
    ace.edit('editor'),
    ace.edit('compiled'),
    ace.edit('console')
  ]

  // set common options for all editors
  ;[editor, compiled, result].forEach(target => {
    target.setTheme('ace/theme/tomorrow')
    target.session.setMode('ace/mode/javascript')
    target.setHighlightActiveLine(false)
    target.setHighlightGutterLine(false)
    target.$blockScrolling = Infinity
  })

  // set individual editor options
  compiled.setReadOnly(true)

  editor.getSession().setUseSoftTabs(true)
  editor.getSession().setTabSize(2)

  result.setShowPrintMargin(false)
  result.renderer.setShowGutter(false)
  result.setReadOnly(true)

  if (state) {
    editor.setValue(state.editor)
    compiled.setValue(state.compiled)
    result.setValue(state.result)

    ;[editor, compiled, result].forEach(_.clearSelection())
  }

  return { editor, compiled, result }
}

const { editor, compiled, result } = loadEditors(getStorage('editorState'))

if (!getStorage('tourComplete')) {
  let isReadmeURL = getQueryProp('readme')
  if (isReadmeURL) removeQueryProp('readme')

  closeButton.click()

  const tour = new Tour({
    defaults: {
      classes: 'shepherd-theme-square',
      scrollTo: true,
      showCancelLink: true
    }
  })

  tour.addStep('readme-button', {
    title: `docs are just a click away`,
    text:
      `These editors make it easy to try out the plugin. ` +
      `If you need help or just a quick reference, ` +
      `click the <i class="material-icons">help</i> button.<br/><br/>` +
      `<i>you will only see this once</i>`
    ,
    attachTo: {
      element: helpButton,
      on: 'bottom'
    },
    buttons: [{
      text: 'next',
      action: () => {
        tour.next()
      }
    }]
  })

  tour.addStep('github-reference', {
    title: `easily head to the GitHub repo`,
    text:
      `The plugin is open source on GitHub! Check it out ` +
      `if you would like to contribute or ` +
      `<i class="material-icons" style="padding-right: 2px;">star</i>` +
      `the project to throw some good vibes.`
    ,
    attachTo: {
      element: helpButton,
      on: 'bottom'
    },
    buttons: [{
      text: 'next',
      action: () => {
        helpButton.click()
        tour.next()
      }
    }]
  })

  tour.addStep('back-to-app-button', {
    title: `back to the editor`,
    text:
      `When you want to return to the editor, click ` +
      `<i class="material-icons">exit_to_app</i> to close the readme.`
    ,
    attachTo: {
      element: closeButton,
      on: 'bottom'
    },
    buttons: [{
      text: 'done',
      action: () => {
        if (!isReadmeURL) closeButton.click()
        tour.complete()
      }
    }]
  })

  tour.once('complete', () => {
    setStorage('tourComplete', true)
  })

  tour.start()
}

const logLineReducer = (list, line, i, col) => {
  if (i === 0 && line.trim() === 'Arguments [') {
    col.splice(-1, 1)
    return list
  }

  const end = line.endsWith(',') ? -1 : line.length
  const add = line.slice(0, end).trim()
  return `${list}${add ? ' ' : ''}${add}`.trim()
}

const tryEval = debounce(input => {
  try {
    const capturer = Object.create(console)

    ;['error', 'log', 'info', 'debug'].forEach(key => {
      capturer[key] = function () {
        Function.prototype.apply.call(console[key], console, arguments)
        let output = ''

        if (arguments.length) {
          const str = prettyFormat(arguments)
          output = str.split('\n').reduce(logLineReducer, '')
        }

        if (output) result.setValue(output)
      }
    })

    Function('console', input)(capturer)
  } catch (e) {
    console.error(e)
    result.setValue(e.message)
  } finally {
    result.clearSelection()
  }
}, 200)

const persist = debounce(state => {
  if (!state) {
    state = {
      editor: editor.getValue(),
      compiled: compiled.getValue(),
      result: result.getValue()
    }
  }

  setStorage('editorState', state)
}, 500)

editor.getSession().on('change', debounce(handleCodeChange, 200))

function handleCodeChange () {
  const source = editor.getValue()
  let initial

  try {
    ;({ code: initial } = transform(source, {
      presets: [],
      plugins: [plugin]
    }))
  } catch (e) {
    compiled.setValue(e.message)
  } finally {
    compiled.clearSelection()
  }

  if (!initial) return

  const formatted = format(initial, {
    printWidth: 50,
    useTabs: false,
    tabWidth: 2,
    singleQuote: true,
    semi: false
  })

  compiled.setValue(formatted)
  compiled.clearSelection()

  tryEval(initial)
  persist()
}
