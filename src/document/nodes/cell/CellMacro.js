import BlockNodeMacro from '../../ui/BlockNodeMacro'

/**
 * A macro for creating cells
 *
 * The three main types of cells are supported by this macro.
 *
 * 1. Mini cells: lines starting with an assignment e.g.
 *
 *    `= 4 * 5` -> `4 * 5`
 *    `x = y * 6` -> `x = y * 6`
 *
 * 2. Call cells: lines starting with a tilde e.g.
 *
 *    `~` -> `call()`
 *    `~(var1, foo=5)` -> `bar = call(var1, foo=5)`
 *
 * 3. Run cells: lines starting with a shriek e.g.
 *
 *    `!` -> `run()`
 *
 * @class      CellMacro (name)
 */
class CellMacro extends BlockNodeMacro {

  get appliesTo () {
    return ['paragraph']
  }

  get regex () {
    return /^(\w+)?=(.+) {2}$/
  }

  createNodeData (match) { // eslint-disable-line no-unused-vars
    let expr = '__expr__'
    return {
      type: 'cell',
      expr: expr
    }
  }
}

export default CellMacro
