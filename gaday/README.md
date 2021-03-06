

Todo:
- Todo postmail 逻辑开发
- 优化 （http://ytiurin.github.io/html5tooltipsjs/）

Done:
- Todo 邀请函html待定


Archive:
- 二维码生成 API，加上被邀请人的github id信息，用于进入自动填写


## 参考文档

- Growth and Design Spec
https://docs.google.com/document/d/1stufeFLI3gJjKw1ttGGv7FlFL2ZnR9P2DI40gYn8aQQ/edit#

- Github info Sheet
https://docs.google.com/spreadsheets/d/1qH7SC9BFRKlnnW6GyxLluNf4wSNUlwQjkSOlgQ76E30/edit#gid=1211262518


## 目录结构

- contributors 用于生产 contributors.json （从PingCAP主要项目拉取contributors）和提取 github id 的email
- invitation-letter 使用 contributors.json 生成的invitation-letter的图片邀请函
- postmail 使用 contributors.json 信息， 找到图片内容，发送邮件逐个。
- webapi


## Usage

- 从 google sheet github info copy 员工列表（github name)到 pingcap-employee.txt

- 生成主要项目的 contributors.json
node contributors/index.js

- 使用 webapi
node webapi/index.js
wget locahost:8080/api/contributors.json
存放 json 到 webpage 目录下

- 生成静态页
cd webpage
npm run prod:webpack
npm run favicons

- 运行页面
cd webpage
npm run dev

- 生成邀请函图片：
nvm use v8.5
node invitation-letter/generate.js ALL
node invitation-letter/generate.js siva

- 生成邮件列表
node postmail/index.js

- 更新 CDN（not work)
进入到gaday bucket @qiniu 中删除index.html 然后上传新的html，css, js 等文件
cd webpage
下载 https://developer.qiniu.com/kodo/tools/1302/qshell
qshell account ak sk
qshell qupload qiniu.config



## GADay

1 生成邀请函图片 url

- dom 渲染生成图片？
- 二维码生成？

2 contributor parse 和 Github API

contributor 数量在310左右

3 发送邮件和批量生成图片



技术选型：


https://github.com/dmnsgn/frontend-boilerplate


puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true;yarn add puppeteer： 本地开发
构建镜像中需要下载chrome
Downloading Chromium r499413 - 72.4 Mb [=                   ] 4%
By default, Puppeteer downloads and uses a specific version of Chromium so its API is guaranteed to work out of the box. To use Puppeteer with a different version of Chrome, pass in the executable's path when creating a Browser instance:


engine:
Unless the user has set the engine-strict config flag, this field is advisory only will produce warnings when your package is installed as a dependency.
npm config set engine-strict true
npm install 会报错的


async:
Since the arrival of node v 7.6.0 async / await has been supported in node by default.
recommend to use plain loops instead of array iteration methods, they're more performant and often simpler.
To me using Promise.all() with map() is a bit difficult to understand and verbose, but if you want to do it in plain JS that's your best shot I guess.


Contributor:
Contributor: A contributor is someone from the outside not on the core development team of the project that wants to contribute some changes to a project.
Collaborator: A collaborator is someone on the core development team of the project and has commit access to the main repository of the project.

A contributor is merely someone whose commits you have incorporated into your git tree.

检查是否是 org 中的用户：
https://developer.github.com/v3/orgs/members/#check-membership


邮箱 github:
https://inhiro.com/blog/find-user-email-github/
github.activity.getEventsForUserPublic({ ... });
https://github.com/paulirish/github-email/blob/master/github-email.sh

curl "https://api.github.com/users/gaohailang" -s \
    | sed -nE 's#^.*"email": "([^"]+)",.*$#\1#p'
