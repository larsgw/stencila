import vfs from '../../tmp/test-vfs'

export default function readFixture(fileName) {
  let fixture = vfs.readFileSync(`tests/fixture/${fileName}`)
  return fixture
}
