import { LinkPackage } from 'substance'

import LinkMacro from './LinkMacro' 

export default {
  name: 'link',
  configure: function (config) {
    config.import(LinkPackage)
    // TODO: Fix AnnotationMacro to deal with non-trivial macros
    // In the meantime disable this macro
    // config.addMacro(new LinkMacro())
  }
}
