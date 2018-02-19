
import { DefaultDOMElement } from 'substance'

const SHEET_XML = `<?xml version="1.0"?>
<!DOCTYPE sheet PUBLIC "StencilaSheet 1.0" "StencilaSheet.dtd">
<sheet>
  <meta>
    <name>untitled</name>
    <title>Untitled Sheet</title>
    <description></description>
    <columns></columns>
  </meta>
  <data></data>
</sheet>`


export default function sheetFromCSV(csv) {
  let dom = DefaultDOMElement.parseXML(SHEET_XML)
  let rows = window.Plotly.d3.csv.parse(csv)
  let columnNames = Object.keys(rows[0])
  let columnsEl = dom.find('columns')
  let dataEl = dom.find('data')

  columnNames.forEach(columnName => {
    columnsEl.append(
      dom.createElement('col').append(columnName)
    )
  })

  rows.forEach(row => {
    let rowEl = dom.createElement('row')
    columnNames.forEach(columnName => {
      let cellContent = row[columnName]
      rowEl.append(
        dom.createElement('cell').append(cellContent)
      )
    })
    dataEl.append(rowEl)
  })
  return dom.serialize()
}
