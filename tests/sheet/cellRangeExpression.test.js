import test from 'tape'
import { getSandbox, setupEngine, setupSheetEditorSession } from '../testHelpers'
import SheetEditor from '../../src/sheet/SheetEditor'

// Integration tests for src/sheet
test('Sheet: add row', (t) => {
  const sandbox = getSandbox(t)
  let {context, editorSession} = setupSheetEditorSession('blankSheet.xml')
  const sheetEditor = new SheetEditor(null, {
    editorSession
  }, { context })

  sheetEditor.mount(sandbox)

  t.ok(sheetEditor.isMounted(), 'SheetEditor should be mounted')
  t.end()
})
