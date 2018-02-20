export default function getFileContent(file, cb) {
  let reader = new window.FileReader()
  reader.onerror = function(e) {
    const error = e.target.error
    return cb(error)
  }
  reader.onload = function(e) {
    const contents = e.target.result
    return cb(null, contents)
  }
  reader.readAsText(file)
}
