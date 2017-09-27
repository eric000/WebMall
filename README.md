# mall

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


----------
----------
----------



# Vue 2.0 + Node.js 全栈商城
## 前端 Vue2.0全家桶  
 
* vue-cli创建模板 

        # 全局安装 vue-cli
        $ npm install --global vue-cli
        # 创建一个基于 webpack 模板的新项目
        $ vue init webpack my-project
        # 安装依赖，走你
        $ cd my-project
        $ npm install
        $ npm run dev  

* Vue Router （\src\router\index.js） ,<router-link> 创建 a 标签来定义导航链接 ,[官方文档](https://router.vuejs.org/zh-cn/essentials/navigation.html)   

        // 命名的路由
        router.push({ name: 'user', params: { userId: 123 }})

        // 带查询参数，变成 /register?plan=private
        router.push({ path: 'register', query: { plan: 'private' }})
我写成 ` this.$router.push({
                        path:'/orderSuccess?orderId=' + res.result.orderId
                    }) ` 也行，获取链接的值 `$route.query.orderId; `
* 组件文件夹（\src\components）
* Axios  负责异步接口请求 PS（get和post请求参数格式有点不一样的）  
* Vuex 管理登陆状态 （\src\main.js：19 和 \src\components\Header.vue ：84~88）,  Vuex store 实例放在computed中刷新不丢失哦[官方链接](https://vuex.vuejs.org/zh-cn/state.html)
* Vue-LazyLoad 负责图片懒加载  
* Vue-infinite-scroll 负责管理下拉商品更新 （\src\view\GoodList.vue:44 和 \src\view\GoodList.vue:167）  
* DEV下的跨域的代理（config\index.js：30）
* 金额过滤器（\src\util\currency.js）[来源尤大<sup>第70行</sup>](https://github.com/vuejs/vue/blob/1.0/src/filters/index.js)
* import 有坑的，导入的components 注意大小写
* 父子组件&自定义模态框 （\src\components\Modal.vue）[具体父子组件请查看官方文档](https://cn.vuejs.org/v2/guide/components.html#动态-Props)



## 后端 Node.js+Express操作（后端入口\server\bin\www) 
PS.<sup>原谅我没分离=。=  毕竟没域名也没服务期啊。。。</sup>

        $ npm install express-generator -g
        $ express 'itemName'    (默认是jade模板) 
        $ cd [项目所在目录] && npm install 

* 后台接口的路由拦截（\server\app.js：27）
* mongoose模块  
   * 创建数据库原型（\server\models\goods.js）
   * MongoDB数据库连接（\server\routes\goods.js：6）
* mongodb 操作 
  * find(query)返回匹配数据  
  findOne(query, options, callback)返回匹配的第一条数据    
  保存数据save(doc, options, callback)  
  更新集合update(selector, document, options, callback)   
  sort({'键名'：1/-1}) 1：升序，-1：降序
  * skip(num)忽略查询的结果匹配的前num条,limit(num)限制查询的结果条数为num条
  *  条件操作符  

                "$lt"---"<"
                "$lte"---"<="
                "$gt"---">"
                "$gte"---">="
                "$ne"---"!="
  * 修改器 ：数组修改器--$push  
  用法：{ $push : { field : value } }
把value追加到field里面去，field一定要是数组类型才行，如果field不存在，会新增一个数组类型加进去。 
（\server\routes\users.js：115）  
PS.[更多操作符请查看这里'中文的'](http://hahaxiao.techweb.com.cn/archives/469.html)，[官方文档](https://docs.mongodb.com/manual/reference/method/js-collection/)
  * 查看select product list的接口(\server\routes\goods.js:21) 覆盖上述所说
  
* 接口定义？express.Router  
   * get请求获取参数req.param("ParmName")，post请求获取参数req.body.ParmName，获取cookies参数req.cookies.ParmName）
   * 返回信息
   `` res.json({
        status:'状态',
        msg:err.message // 'success msg' // data,
        result:''
            }) ``
   * 设置cookies（\server\routes\users.js：28）,取消cookies（\server\routes\users.js：57）



### 推荐几个插件\软件
* chrome 的 Vue.js devtools
* VS Code 的 Vetur
* robomongo
* pm2 好像猴猴用，可惜我没用（没钱部署不用了）


