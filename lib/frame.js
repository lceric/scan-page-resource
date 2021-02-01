const puppeteer = require('puppeteer-core')

class Frame {
  constructor(opts = {}) {
    this.opts = opts
  }

  static async getInstance(opts) {
    if (!this.instance) {
      this.instance = new Frame(opts)
    }
    return this.instance
  }

  async launch() {
    return await puppeteer.launch(this.opts)
  }

  static async fetcher(version) {
    const bf = puppeteer.createBrowserFetcher()
    const effectVersion = version || this.opts.version
    let info = bf.revisionInfo(effectVersion)
    let finalRes = [1]
    if (info.local) {
      finalRes = [0, info]
    } else if (bf.canDownload(effectVersion)) {
      console.log(
        `downloding ${info.product} ${effectVersion} from ${info.url}`
      )
      info = await bf.download(effectVersion)
      console.log(`downloding ${info.product} ${effectVersion} success`)
      finalRes = [0, info]
    }
    return finalRes
  }
}

module.exports = {
  puppeteer,
  Frame,
}
