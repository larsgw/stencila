/* eslint-disable no-unused-vars */
import { Editing } from 'substance'
import Macro from './Macro'

class InlineNodeMacro extends Macro {

  performAction (match, props, context) {
    props.editorSession.transaction(tx => {

      // Selection for the macro text used to...
      var selection = tx.createSelection({
        type: 'property',
        path: props.path, 
        startOffset: match.index,
        endOffset: match.index + match[0].length
      })

      // Delete the macro text
      tx.update(selection.path, {
        type: 'delete',
        start: selection.start.offset,
        end: selection.end.offset
      })

      // Set cursor position and insert the new node
      tx.setSelection({
        type: 'property',
        path: props.path,
        startOffset: selection.start.offset
      })
      let nodeData = this.createNodeData(match)
      tx.insertInlineNode(nodeData)
    })
  }

}

export default InlineNodeMacro
