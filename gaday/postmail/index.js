/*
  1 read contributors.json
  2 invoke generate.js to image
  2.1 get email from user
  3 invoke email send | loop to mail list
*/

// mailgun send image inline body
// https://github.com/bojand/mailgun-js/issues/161

const Contributors = require('../contributors')

async function main() {
  // Test get email logic
  console.log(await Contributors.getUserEmail('gaohailang'))
  console.log(await Contributors.getUserEmail('octokit'))
  console.log(await Contributors.getUserEmail('shenli'))
  console.log(await Contributors.getUserEmail('queenypingcap'))
  console.log(await Contributors.getUserEmail('hashbone'))
}
main()
