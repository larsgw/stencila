import test from 'tape'
import { getSandbox, setupSheetEditorSession } from '../testHelpers'
import { SheetEditor } from '../../index.es'

const SAMPLE_SHEET = 'numbers.xml'
const VERTICAL_RANGE = 'A2:A5'
const HORIZONTAL_RANGE = 'A3:C3'

// Integration tests for src/sheet
test('Sheet: add row', (t) => {
  const sandbox = getSandbox(t)
  let {context, editorSession} = setupSheetEditorSession(SAMPLE_SHEET)
  const sheetEditor = new SheetEditor(null, {
    editorSession
  }, { context })
  sheetEditor.mount(sandbox)
  setCellValue(editorSession, 7, 3, '=sum('+VERTICAL_RANGE+')')
  //debugger
  const valueBeforeInsertion = getCellValue(editorSession, 7, 3)
  editorSession.setCommandStates({'insert-rows-below': {startRow: 3, endRow: 4, nrows: 1, disabled: false}})
  editorSession.commandManager.executeCommand('insert-rows-below')
  const valueAfterInsertion = getCellValue(editorSession, 7, 3)
  t.ok(sheetEditor.isMounted(), 'SheetEditor should be mounted')
  t.equal(valueBeforeInsertion, '=sum('+VERTICAL_RANGE+')')
  t.equal(valueAfterInsertion, '=sum(A2:A6)')
  t.end()
})

function setCellValue(editorSession, rowIdx, colIdx, val) {
  editorSession.transaction((tx) => {
    const sheet = tx.getDocument()
    let cell = sheet.getCell(rowIdx, colIdx)
    cell.textContent = val
  })
}

function getCellValue(editorSession, rowIdx, colIdx) {
  const sheet = editorSession.getDocument()
  const cell = sheet.getCell(rowIdx, colIdx)
  return cell.getText()
}
