





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
