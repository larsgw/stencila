import test from 'tape'
import { getSandbox, setupArticleEditorSession } from '../testHelpers'
import { ArticleEditor } from '../../index.es'

// Integration tests for src/article
test('Article: mount', (t) => {
  const sandbox = getSandbox(t)
  let {context, editorSession} = setupArticleEditorSession('blankArticle.xml')
  const articleEditor = new ArticleEditor(null, {
    editorSession
  }, { context })
  ArticleEditor.mount(sandbox)

  t.ok(articleEditor.isMounted(), 'ArticleEditor should be mounted')
  t.end()
})
