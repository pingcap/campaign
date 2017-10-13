// import GithubApi from 'github'
const GithubApi = require('github')

const github = new GithubApi({
  // debug: true,
  // Promise: require('bluebird')
})


/*

  contributor schema
  [{
    login, contributions, avatar_url
  }]
  issues schema
  [{
    user: {login, avatar_url},
  }]
 */

 /*
   结构如下：
   [{
     username: '',
     avatar: '',
     repos: [{
       count: 2,
       name: 'tidb'
     }]
   }]
  */

const RepoList = ['docs', 'docs-cn', 'tidb', 'tikv', 'pd', 'tispark']

// Todo abstract to fetch all paginated kind resources
async function getRepoContributor(repo) {
  let all = []
  let res = await github.repos.getContributors({
    owner: 'pingcap',
    repo: repo,
    per_page: 100
  })
  await inner(res)
  return all

  async function inner(res) {
    all = all.concat(res.data)
    if(github.hasNextPage(res)) {
      let _r = await github.getNextPage(res)
      inner(_r)
    } else {
      console.log(all.length)
    }
  }
}

function getContributionLevel(num) {
  function between(x, min, max) {
    return x >= min && x <= max
  }
  let level = 0
  between(num, 1, 1) && (level = 1)
  between(num, 2, 2) && (level = 2)
  between(num, 3, 15) && (level = 3)
  between(num, 16, Infinity) && (level = 4)

  return level
}


const fs = require('fs')

async function main() {
  let RepoIssuesList = []
  for(let i of RepoList) {
    RepoIssuesList.push(await getRepoContributor(i))
  }

  let aggr = {}
  RepoIssuesList.forEach((list, idx)=>{

    console.log(`Repo ${RepoList[idx]} has ${list.length} contributors`)
    list.forEach(c=>{
      const {login, contributions, avatar_url} = c
      const repo = RepoList[idx] // Todo 确认是否无问题，push await 顺序
      if(!aggr[login]) {
        aggr[login] = {
          avatar: avatar_url,
          repos: {}
        }
      }

      aggr[login].repos[repo] = getContributionLevel(contributions)

    })
  }, {})
  console.log(aggr)
  fs.writeFileSync('./contributors.json', JSON.stringify(aggr), 'utf8')
  // hash -> array
}

const isCLI = require.main === module
if (isCLI) {
  try{
    main()
  }catch(e) {
    console.log(e)
  }
}

module.exports = exports = {
  async getUserEmail(username) {
    try{
      let res1 = await github.repos.getForUser({
        username,
        sort: 'updated'
      })
      let res2 = await github.repos.getCommits({
        owner: username,
        repo: res1.data[0].name
      })
      return res2.data[0].commit.author.email
    }catch(e) {
      console.log(e)
      return null
    }

    // get email from commit

    /*const res = await github.activity.getEventsForUserPublic({
      username
    })
    let email
    try{
      email = res.data.filter((i)=>{i.type === 'PushEvent'})[0].payload.commits[0].author.email
    }catch(e) {
      console.log(edge)
    }
    return email*/
  }
}


// main
