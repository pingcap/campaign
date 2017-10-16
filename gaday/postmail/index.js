/*
  1 read contributors.json
  2 invoke generate.js to image
  2.1 get email from user
  3 invoke email send | loop to mail list
*/

// mailgun send image inline body
// https://github.com/bojand/mailgun-js/issues/161

const Contributors = require('../contributors/index.js')
const fs = require('fs')

async function main() {
  // Test get email logic
  // console.log(await Contributors.getUserEmail('gaohailang'))
  // console.log(await Contributors.getUserEmail('octokit'))
  // console.log(await Contributors.getUserEmail('shenli'))
  // console.log(await Contributors.getUserEmail('queenypingcap'))
  console.log(await Contributors.getUserEmail('hashbone'))

  const contributorsData = JSON.parse(fs.readFileSync(`${__dirname}/../webpage/contributors.json`, 'utf8'))
  const listActions = Object.keys(contributorsData).filter((i)=> !contributorsData[i].repos.family) // Family and not

  const result = []
  for (i of listActions) {
    const mail = await Contributors.getUserEmail(i)
    console.log(mail)
    result.push(`${i},${mail}`)
    fs.writeFileSync('mailist.txt', result.join('\n'), 'utf8')
  }
  fs.writeFileSync('mailist.txt', result.join('\n'), 'utf8')
}
main()
