const puppeteer = require('puppeteer');

// https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagescreenshotoptions

async function generate(name) {
  console.log('generate.. ', name)
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 540,
      height: 960,
      deviceScaleFactor: 2, // retina
    })
    await page.goto(`file://${__dirname}/index.html#${name}`);
    await page.screenshot({
      quality: 30,
      type: 'jpeg',
      path: `${__dirname}/images/${name}.jpeg`
    });
    return await browser.close();
  } catch (e) {
    console.log('Err: ', e)
    return Promise.reject(e)
  }
}

async function loop() {
  const contributorsData = JSON.parse(fs.readFileSync(`${__dirname}/../webpage/contributors.json`, 'utf8'))
  const listActions = Object.keys(contributorsData).filter((i)=> !contributorsData[i].repos.family) // Family and not
  console.log(listActions.length)

  for (i of listActions) {
    await generate(i)
  }
}

if (process.argv.length < 3) {
  console.log('Usage: node generate.js username')
}

const GithubName = process.argv[2]
const fs = require('fs')

// Todo check json exists
if (GithubName === 'ALL') {
  loop()
} else {
  generate(GithubName || 'Demo')
}


// throttlep :: Number -> [(* -> Promise)]
function throttlep(n) {
  return Ps => new Promise((pass, fail) => {
    // r is the number of promises, xs is final resolved value
    let r = Ps.length,
      xs = []
    // decrement r, save the resolved value in position i, run the next promise
    let next = i => x => (r--, xs[i] = x, run(Ps[n], n++))
    // if r is 0, we can resolve the final value xs, otherwise chain next
    let run = (P, i) => r === 0 ?
      pass(xs) :
      P().then(next(i), fail)
    // initialize by running the first n promises
    Ps.slice(0, n).forEach(run)
  })
}
