const { Frame } = require('./frame')

class Browser extends Frame {
  constructor(opts = {}) {
    super(opts)
    this.frame = null
    this.page = null
    this.executablePath = opts.executablePath
  }

  /**
   * get browser
   * @param {Object} opts options
   */
  async init(config) {
    let opts = config || this.opts
    if (!this.browser) {
      // 获取
      if (opts.version && !this.executablePath) {
        const [err, { executablePath }] = await Frame.fetcher(opts.version)
        if (err) {
          console.log('download failed')
        }
        this.executablePath = executablePath
        this.opts.executablePath = executablePath
      }
      this.frame = await Frame.getInstance(this.opts)
      this.browser = await this.frame.launch()
    }
    return this.browser
  }

  static async getInstance(opts) {
    if (!this.instance) {
      this.instance = new Browser(opts)
    }
    return this.instance
  }

  async createPage() {
    // if (!this.browser) await this.getBrowser(opts)
    return await this.browser.newPage()
  }

  async createSinglePage() {
    if (!this.page) {
      this.page = await this.createPage()
    }
    return this.page
  }

  async close(browser) {
    let bi = browser || this.browser
    if (!bi) return
    await bi.close()
  }
}

module.exports = {
  Browser,
}
