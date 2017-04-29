import { Editing } from 'substance'
import Macro from './Macro'

class BlockNodeMacro extends Macro {

  get appliesTo () {
    return ['paragraph']
  }

  performAction (match, props) {
    props.editorSession.transaction((tx,args) => {
      // Create the new node
      var newNode = tx.create(
        this.createNodeData(match)
      )

      // Hide the old node, show the new node
      var container = tx.get(args.selection.containerId)
      var pos = container.getPosition(props.node.id)
      if (pos >= 0) {
        container.hide(props.node.id)
        container.show(newNode.id, pos)
      }

      // Delete the old node
      let editing = new Editing()
      editing.delete(tx, props.node.id, args.selection.containerId)

      // Set the cursor position to the end heading
      var path
      if (newNode.isText()) path = newNode.getTextPath()
      else path = [newNode.id]
      tx.setSelection({
        type: 'property',
        path: path,
        startOffset: 0
      })
    })
  }

}

export default BlockNodeMacro
