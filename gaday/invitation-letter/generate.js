const puppeteer = require('puppeteer');

async function generate(name) {
  const browser = await puppeteer.launch();
  try{
    const page = await browser.newPage();
    await page.goto(`file://${__dirname}/index.html#${name}`);
    await page.screenshot({path: `${__dirname}/images/${name}.png`});
  }catch(e) {
    console.log('Err: ', e)
  }
  await browser.close();
}

if(process.argv.length < 3) {
  console.log('Usage: node generate.js username')
}

generate(process.argv[2]||'Demo')
