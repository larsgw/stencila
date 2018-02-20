import getFileContent from '../util/getFileContent'
import sheetFromCSV from '../sheet/sheetFromCSV'

let createCellNode = function(tx) {
  let cell = tx.createElement('cell')
  cell.append(
    tx.createElement('source-code').attr('language', 'mini'),
    tx.createElement('output').attr('language', 'json')
  )
  return cell
}

export default {
  type: 'drop-asset',
  match(params) {
    // We can add more table foramts later (TSV, xlsx etc)
    const isTable = params.file.type === 'text/csv'
    return params.type === 'file' && isTable
  },
  drop(tx, params, context) {
    const isCSV = params.file.type === 'text/csv'
    if(isCSV) {
      const fileName = params.file.name.split('.')[0]
      getFileContent(params.file, (err, file) => {
        if(err) return console.error(err)
        const archive = context.archive
        const type = 'application/sheetml'
        const sheetXML = sheetFromCSV(file)
        const sheetId = archive.addDocument(type, fileName, sheetXML)

        let node = createCellNode(tx, params, context)
        tx.insertBlockNode(node)
        let code = node.find('source-code')
        // Here we most load sheetId and get label of first cell and last cell
        // then we should append to code sheetId + '!' + firstCellLabel + ':' + lastCellLabel
        let sel = tx.selection
        tx.setSelection({
          type: 'property',
          path: code.getPath(),
          startOffset: 0,
          surfaceId: sel.surfaceId,
          containerId: sel.containerId
        })
      })
    }
  }
}
