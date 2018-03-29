import { isFunction, DefaultDOMElement } from 'substance'
import {
  ArticleAdapter, ArticleLoader, Engine,
  FunctionManager, SheetAdapter, SheetLoader
} from '../index.es'
import JsContext from '../src/contexts/JsContext'
import MiniContext from '../src/contexts/MiniContext'
import { libtestXML, libtest } from './contexts/libtest'
import readFixture from './fixture/readFixture'

export function spy(self, name) {
  var f
  if (arguments.length === 0) {
    f = function() {}
  }
  else if (arguments.length === 1 && isFunction(arguments[0])) {
    f = arguments[0]
  }
  else {
    f = self[name]
  }
  function spyFunction() {
    var res = f.apply(self, arguments)
    spyFunction.callCount++
    spyFunction.args = arguments
    return res
  }
  spyFunction.callCount = 0
  spyFunction.args = null
  spyFunction.restore = function() {
    if (self) {
      self[name] = f
    }
  }
  spyFunction.reset = function() {
    spyFunction.callCount = 0
    spyFunction.args = null
  }
  if (self) {
    self[name] = spyFunction
  }
  return spyFunction
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export function getSandbox(t) {
  // when running with substance-test we get
  // a sandbox for each test
  if (t.sandbox) return t.sandbox
  // otherwise we create our own DOM
  let htmlDoc = DefaultDOMElement.parseHTML('<html><body></body></html>')
  return htmlDoc.find('body')
}

export function setupArticleEditorSession(sheet) {
  let context = setupEngine()
  const fixture = readFixture(sheet)
  const editorSession = ArticleLoader.load(fixture, context)
  ArticleAdapter.connect(context.engine, editorSession, sheet)
  return {context, editorSession}
}

export function setupSheetEditorSession(sheet) {
  let context = setupEngine()
  const fixture = readFixture(sheet)
  const editorSession = SheetLoader.load(fixture, context)
  SheetAdapter.connect(context.engine, editorSession, sheet)
  return {context, editorSession}
}

export function setupEngine() {
  // A JsContext with the test function library
  let jsContext = new JsContext()
  let miniContext
  jsContext.importLibrary('test', libtest)
  // Function manager for getting function specs
  let functionManager = new FunctionManager()
  functionManager.importLibrary('test', libtestXML)
  // A mock Host that provides the JsContext when requested
  let host = {
    _disable(val) {
      this._disabled = val
    },
    createContext: function(lang) {
      if (this._disabled) {
        return Promise.resolve(new Error('No context for language '+lang))
      }
      switch (lang) {
        case 'js':
          return Promise.resolve(jsContext)
        case 'mini':
          return Promise.resolve(miniContext)
        default:
          return Promise.resolve(new Error('No context for language '+lang))
      }
    },
    functionManager
  }
  miniContext = new MiniContext(host)
  let engine = new Engine({ host })
  let graph = engine._graph
  return { host, engine, graph }
}
