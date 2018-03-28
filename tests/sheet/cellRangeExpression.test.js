import test from 'tape'
import { isNil } from 'substance'
import { getSandbox, setupEditorSession } from '../testHelpers'
import SheetEditor from '../../src/sheet/SheetEditor'

// Integration tests for src/sheet
test('Sheet: add row', (t) => {
  const sandbox = getSandbox(t)
  const editorSession = setupEditorSession()
  const sheet = SheetEditor.mount({
    editorSession
  }, sandbox)

  t.ok(sheet.isMounted(), 'SheetEditor should be mounted')
  t.end()
})
