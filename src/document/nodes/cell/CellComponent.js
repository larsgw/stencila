import { Component, TextPropertyEditor, findParentComponent, parseKeyEvent } from 'substance'
import CodeEditorComponent from '../../ui/CodeEditorComponent'
import CellValueComponent from './CellValueComponent'

class CellComponent extends Component {

  didMount() {
    const node = this.props.node
    const editorSession = this.context.editorSession
    editorSession.on('render', this.onCellChanged, this, {
      resource: 'document',
      path: [node.id]
    })
  }

  dispose() {
    const editorSession = this.context.editorSession
    editorSession.off(this)
  }

  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-cell')
    el.append(
      $$('div').addClass('se-expression').append(
        $$(TextPropertyEditor, {
          path: [node.id, 'expression'],
          commands: ['undo', 'redo', 'select-all']
        }).ref('expressionEditor')
          .on('enter', this.onExpressionEnter)
      )
    )
    if (node.isExternal) {
      el.append(
        $$(CodeEditorComponent, {
          path: [node.id, 'sourceCode'],
          language: node.language
        }).ref('sourceCodeEditor')
          .on('escape', this.onEscapeFromCodeEditor)
      )
    }
    if (node) {
      el.append(
        $$(CellValueComponent, {node})
        .ref('value')
      )
    }
    el.on('click', this.onClick)
    return el
  }

  getExpression() {
    return this.refs.expressionEditor.getContent()
  }

  onClick(event) {
    let target = findParentComponent(event.target)
    // console.log('###', target, target._owner)
    if (target._owner === this.refs.expressionEditor || target._owner === this.refs.sourceCodeEditor) {
      // console.log('### skipping')
      // console.log(this.context.editorSession.getSelection())
      return
    }
    event.stopPropagation()
    this.context.isolatedNodeComponent.selectNode()
  }

  onEscapeFromCodeEditor(event) {
    event.stopPropagation()
    this.send('escape')
  }

  onExpressionEnter(event) {
    // EXPERIMENTAL: we want an easy way to insert content after the
    const data = event.detail
    const editorSession = this.context.editorSession
    const modifiers = parseKeyEvent(data, 'modifiers-only')
    switch(modifiers) {
      case 'ALT': {
        editorSession.setSelection(this._afterNode())
        editorSession.executeCommand('insert-cell')
        break
      }
      case 'CTRL': {
        this.props.node.recompute()
        break
      }
      case 'SHIFT': {
        editorSession.transaction((tx) => {
          tx.insertText('\n')
        })
        break
      }
      case '': {
        editorSession.setSelection(this._afterNode())
        editorSession.executeCommand('insert-node', {type:'paragraph'})
        break
      }
      default:
        //
    }
  }

  onCellChanged() {
    this.rerender()
  }

  _afterNode() {
    // HACK: not too happy about how difficult it is
    // to set the selection
    const node = this.props.node
    const isolatedNode = this.context.isolatedNodeComponent
    const parentSurface = isolatedNode.getParentSurface()
    return {
      type: 'node',
      nodeId: node.id,
      mode: 'after',
      containerId: parentSurface.getContainerId(),
      surfaceId: parentSurface.id
    }
  }

}

CellComponent.noBlocker = true

export default CellComponent
