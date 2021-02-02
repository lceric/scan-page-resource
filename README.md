# scan-page-resource

[![view on npm](http://img.shields.io/npm/v/scan-page-resource.svg)](https://www.npmjs.com/package/scan-page-resource)
[![npm module downloads per month](http://img.shields.io/npm/dm/scan-page-resource.svg)](https://www.npmjs.org/package/scan-page-resource)

Scan page resource loading results. Support multiple pages.

## Usage

```bash
npm i -S scan-page-resource
```

```js
const { scan } = require('scan-page-resource')
const urlList = ['https://github.com/']

scan(urlList)
```

**more**

```js
const { scan } = require('scan-page-resource')
// each page created
eventBus.on('page-created', function (page) {
  const cookies = []
  page.setCookie(...cookies)
})
// flow end
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
```

**output**

```json
{
  "https://apps.bdimg.com/libs/fontawesome/4.4.0/fonts/fontawesome-webfont.woff2?v=4.4.0": {
    "errorText": "net::ERR_FAILED"
  }
}
```
