const { scan, eventBus } = require('../lib')
const { urlList } = require('./const')

scan(urlList)

eventBus.on('page-created', async function (page) {
  const cookies = [
  ]
  await page.setCookie(...cookies)
})

eventBus.on('flow-end', (errorStates) => {
  console.log('flow-end')
  // browser.close()
  console.dir(errorStates)
  let out = {}
  for (let [k, v] of errorStates) {
    out[k] = v
  }
  console.log(out)
  fs.writeFileSync(
    path.resolve(__dirname, './output.json'),
    Buffer.from(JSON.stringify(out, null, 2))
  )
})
