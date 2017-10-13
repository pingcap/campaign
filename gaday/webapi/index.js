/*
  Express API
  - 返回所有的contributor + hack with employee
  - 点亮效果相关 get list/post item 接口
*/

const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const low = require('lowdb');
const storage = require('lowdb/adapters/FileAsync');


//创建一个Express服务器
const server = jsonServer.create();

//使用json-server默认选择的中间件（logger，static, cors和no-cache）
server.use(jsonServer.defaults());

//使用body-parser中间件
server.use(bodyParser.json());


//数据文件
const dbfile = (true || process.env.prod === '1') ? 'db.json' : '_db.json';

//创建一个lowdb实例
const db = low(new storage(dbfile));

// const md5 = str => crypto
//     .createHash('md5')
//     .update(str.toString())
//     .digest('hex');


// 暴露contributors
const fs = require('fs')
// 读取 employee.txt 处理成json
var employeeTxt = fs.readFileSync(`${__dirname}/../pingcap-employee.txt`, 'utf8')
const employeeList = employeeTxt.split(/\n/).filter((i)=>{
  return (i !== '/') && (i!=='')
}).slice(1) // omit first - column head - github name
console.log(employeeList)

const contributorsData = JSON.parse(fs.readFileSync(`${__dirname}/../contributors.json`, 'utf8'))
server.get('/api/contributors', (req, res)=>{
  employeeList.forEach((i)=>{
    if(contributorsData[i]) {
      contributorsData[i].repos.family = 3
    } else {
      contributorsData[i] = {
        "avatar": null,
        "repos": {
          "family": 3
        }
      }
    }

  })
  res.json(contributorsData)
})

//路由配置
const router = jsonServer.router(dbfile);
server.use('/api', router);

//启动服务，并监听5000端口
server.listen(5000, () => {
  console.log('server is running at ', 5000, dbfile);
});
