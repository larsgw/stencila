/*
  WIP: a tiny integration of a Stencila Document editor
  using a set of stub services.
*/

import wrapSnippet from '../docs/wrapSnippet'
import example from '../docs/simple-sheet'
import { EditorSession } from 'substance'
import { SheetEditor, SheetConfigurator, sheetConversion, CellEngine } from 'stencila'

window.addEventListener('load', () => {
  let configurator = new SheetConfigurator()
  let doc = sheetConversion.importHTML(wrapSnippet(example))
  let editorSession = new EditorSession(doc, {
    configurator: configurator
  })
  let cellEngine = new CellEngine(editorSession)
  window.doc = doc
  SheetEditor.mount({
    editorSession,
    cellEngine,
    edit: true
  }, window.document.body)
})
