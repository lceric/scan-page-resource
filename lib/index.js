const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const { Frame, puppeteer } = require('./frame')
const { Browser } = require('./browser')

const errorStates = new Map()
const eventBus = new EventEmitter()

/**
 * scan pages source loaded
 * @param {Array} list URL List
 */
async function scan(
  list,
  opts = {
    version: '818858',
    headless: false,
    loopSleep: 2000,
  }
) {
  eventBus.emit('flow-before')
  const { loopSleep, ...insOpts } = opts
  const ins = await Browser.getInstance(insOpts)
  await ins.init()
  const browser = ins.browser

  eventBus.emit('flow-start', browser)

  let nextUrl = getNext(0, list)
  async function loop() {
    await sleep(loopSleep)
    let url = nextUrl.next().value
    if (!url) return
    let page = await webPage(browser, url)
    await page.close()
    await loop()
  }
  await loop()

  eventBus.emit('flow-end', errorStates, browser)
}

function* getNext(idx, list) {
  while (idx < list.length) {
    yield list[idx]
    idx++
  }
}

/**
 * poppteer page
 * @param {Object} browser Poppteer Browser
 * @param {String} url page url
 * @param {Function} loadFn page on load callback
 */
async function webPage(browser, url) {
  let $resolve = null
  let $promise = new Promise((resolve) => {
    $resolve = resolve
  })
  let page = await browser.newPage()

  eventBus.emit('page-created', page, browser, url)

  page.on('request', handleRequest)
  page.on('requestfailed', handleRequestFailed)

  page.on('domcontentloaded', () => {
    console.log(`${url} domcontentloaded`)
    eventBus.emit('page-domcontentloaded', page, browser, url)
    $resolve(page)
  })

  await page.goto(url)

  eventBus.emit('page-goto-end', page, browser, url)
  // await page.setRequestInterception(true)

  // page.off('request', handleRequest)
  // page.off('requestfailed', handleRequestFailed)
  return $promise
}

async function sleep(time) {
  let $resolve = null
  let p = new Promise((resolve) => ($resolve = resolve))
  setTimeout(() => {
    $resolve()
  }, time)
  return p
}

function handleRequest(request) {
  eventBus.emit('page-request', request)
  // console.log('A request was made:', request.url(), request)
}

function handleRequestFailed(request) {
  let url = request.url()
  let errorText = request.failure().errorText
  console.log(`${url} [${errorText}]`)
  errorStates.set(url, request.failure())
  eventBus.emit('page-request-failed', request, errorStates)
}

module.exports = {
  Frame,
  Browser,
  puppeteer,
  eventBus,
  sleep,
  scan,
  webPage,
}
