import Macro from './Macro'

class AnnotationMacro extends Macro {

  performAction (match, props) {
    props.editorSession.transaction(tx => {

      // Selection for the macro text used to...
      var selection = tx.createSelection({
        type: 'property',
        path: props.path, 
        startOffset: match.index,
        endOffset: match.index + match[0].length
      })

      // Delete the macro delimiters
      tx.update(selection.path, {
        type: 'delete',
        start: selection.start.offset,
        end: selection.start.offset + 1
      })
      tx.update(selection.path, {
        type: 'delete',
        start: selection.end.offset - 2,
        end: selection.end.offset - 1
      })

      // Create annotation
      var data = this.createNodeData(match)
      data.path = selection.path
      data.startOffset = selection.start.offset
      data.endOffset = selection.end.offset - 2
      tx.create(data)

      // Insert a space at end of the annotation and set selection 
      // to after it so that the cursor is no longer 'within' the
      // annotation
      tx.update(selection.path, {
        type: 'insert',
        start: selection.end.offset - 2,
        text: ' '
      })
      tx.setSelection({
        type: 'property',
        path: selection.path,
        startOffset: selection.end.offset - 1
      })
    })
  }

}

export default AnnotationMacro
