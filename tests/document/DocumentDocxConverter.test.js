import test from 'tape'
import MemoryBuffer from '../../src/backend/MemoryBuffer'
import TestStorer from '../backend/TestStorer'

import DocumentDocxConverter from '../../src/document/DocumentDocxConverter'
const converter = new DocumentDocxConverter()


test('DocumentDocxConverter.match', function (t) {
  t.ok(DocumentDocxConverter.match('foo.docx'))
  t.notOk(DocumentDocxConverter.match('foo.bar'))
  t.end()
})

test.skip('DocumentDocxConverter.importDocument', function (t) {
  let converter = new DocumentDocxConverter()
  let storer = new TestStorer('/path/to/storer', 'hello-world.docx')
  storer.writeFile('hello-world.docx', 'text/docx', 'Hello world')
  let buffer = new MemoryBuffer()

  converter.importDocument(
    storer,
    buffer
  ).then((manifest) => {
    t.equal(manifest.type, 'document')
    buffer.readFile('index.html', 'text/html').then((html) => {
      t.equal(html, `<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <main>
      <div id="data" data-format="html">
        <div class="content"><p>Hello world</p></div>
      </div>
    </main>
  </body>
</html>`)
      t.end()
    })
  })
})

test('DocumentDocxConverter.exportDocument', function (t) {
  let converter = new DocumentDocxConverter()
  let buffer = new MemoryBuffer()
  buffer.writeFile('index.html', 'text/html', `<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <main>
      <div id="data" data-format="html">
        <div class="content"><p>Hello world</p></div>
      </div>
    </main>
  </body>
</html>`)
  let storer = new TestStorer('/path/to/storer', 'hello-world.docx')

  converter.exportDocument(
    buffer,
    storer,
    {converter: 'none'}
  ).then(() => {
    storer.readFile('hello-world.docx', 'text/plain').then(docx => {
      t.equal(docx, 'DocumentDocxConverter.exportDocument was run with converter: none')
      t.end()
    })
  })
})

test('DocumentDocxConverter.exportContent', t => {
  const e = html => converter.exportContent(`<div>${html}</div>`)

  t.equal(
    e('<p>An input <input name="var1" value="3"></p>'),

      '<p>An input 3<a href="#fn1" class="footnoteRef" id="fnref1"><sup>1</sup></a></p>' +
      '<div class="footnotes"><ol><li id="fn1"><p>input name=var1<a href="#fnref1">↩</a></p></li></ol></div>'
  )

  t.equal(
    e('<p>An output <output for="6*7">42</output></p>'),
      '<p>An output <output for="6*7">42</output></p>'
  )

  t.equal(
    e('<div data-cell="var2=sum(var1)"></div>'),
      '<div data-cell="var2=sum(var1)"></div>'
  )

  t.end()
})
