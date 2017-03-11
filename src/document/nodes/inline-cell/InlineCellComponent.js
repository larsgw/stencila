import { Component } from 'substance'

class InlineCellComponent extends Component {

  didMount() {
    const node = this.props.node
    if (node) {
      node.on('value:changed', this.rerender, this)
    }
  }

  dispose() {
    const node = this.props.node
    if (node) {
      node.off(this)
    }
  }

  render($$) {
    let node = this.props.node
    let el = $$('span').addClass('sc-inline-cell')
    if (node.value) {
      el.text(String(node.getValue()))
    } else if (node.output) {
      el.text(node.output)
    }
    if (node.hasError()){
      el.text(String(node.getError()))
      el.addClass('sm-error')
    }
    return el
  }

}

export default InlineCellComponent
