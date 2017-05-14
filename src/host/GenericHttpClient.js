import {PUT} from '../util/requests'

/**
 * A HTTP client for a remote instance
 *
 * Implements remote procedure calls (RPC) to an instance hosted
 * by another `Host` in a different process
 */
export default class GenericHttpClient {

  constructor(url) {
    this.url = url
  }

  call (method, ...args) {
    return PUT(this.url + '!' + method, args)
  }
}
