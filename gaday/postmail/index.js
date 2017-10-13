/*
  1 read contributors.json
  2 invoke generate.js to image
  2.1 get email from user
  3 invoke email send | loop to mail list
*/

const Contributors = require('../contributors')

async function main() {
  console.log(await Contributors.getUserEmail('gaohailang'))
  console.log(await Contributors.getUserEmail('octokit'))
  console.log(await Contributors.getUserEmail('shenli'))
  console.log(await Contributors.getUserEmail('queenypingcap'))
  console.log(await Contributors.getUserEmail('hashbone'))
}
main()
