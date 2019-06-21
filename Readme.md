# 前端说明
## 关键功能实现
+ <strong>注册功能</strong>
用户提交信息，将数据保存到数据库。每条用户信息以id作为唯一标识，id由数据库自行生成。注册时会检测用户名称，若与已存在用户名称相同，将无法注册。

+ <strong>登录功能</strong>
用户提交信息，后端进行数据检测，如果用户名和密码匹配，则提示登陆成功，并路由跳转到场景页面；否则弹框提示错误信息

+ <strong>人物位置更新</strong>
在每次渲染场景时，客户端会通过socket，将自己的位置信息发送到服务端，服务端将会把这些信息传给其他所有用户。每个用户都保存有对应其他用户的模型，只需要将模型位置更新为服务端发送过来的新值，场景中对应的模型就自动移动到新位置。

+ <strong>用户信息修改</strong>
用户可以修改个人信息，包括用户名、密码；如果修改密码，修改成功后将要求用户重新登录

+ <strong>场景切换</strong>
一共有5个场景，每个场景实际上都是一个3DObject对象

+ <strong>物品展示</strong>

## 附加功能实现

+ <strong>多人/单人聊天</strong>

+ <strong>智能系统助手</strong>

+ <strong>宠物更换</strong>

+ <strong>答题机制</strong>

# 后端说明文档
## 简介
本次后端采用基于Node.js平台的下一代web框架-Koa实现，利用的技术如下：
+ websocket实现单人、多人聊天功能
+ 使用模板引擎art-template进行界面渲染，
+ Mongodb作为数据库存储数据
+ 调用图灵机器人API实现与NPC智能对话功能

## 详细说明
+ websocket：
    + login事件：登录后触发该事件，此时服务端将昵称与socketid存储在Map中，并且将Map中的数据发送给所有客户端
    + chatOne事件：单人聊天时触发该事件，此时服务端将客户端的信息发送给另一个客户端
    + chatMany事件：多人聊天时触发该事件，服务端将客户端发送的信息广播给其他客户端
    + player事件：有玩家上线时触发该事件，服务端将该玩家的信息广播给其他所有客户端
    + disconnect事件：有玩家下线时触发该事件，服务端广播下线玩家信息给其他所有客户端

+ art-template:
    + 配置如下：
        ```
        {
            const render = require('koa-art-template');
            render(app, {
                // 指定文件夹
                root: path.join(__dirname, 'views'),
                // 指定模板引擎后缀
                extname: '.html',
                // 指定开发模式
                debug: process.env.NODE_ENV !== 'production'
            });
        }
        ```

+ Mongodb:
为方便数据库的CURD操作，此次对Mongodb进行封装，并且利用单例模式减少与数据库建立连接的时间

+ 图灵机器人：
    + 利用axios模块向```http://openapi.tuling123.com/openapi/api/v2```发送post请求，并得到返回的数据：实现如下：
        ```
        let res = await axios.post('http://openapi.tuling123.com/openapi/api/v2', {
                "reqType": 0,
                "perception": {
                    "inputText": {
                        "text": ctx.request.body.chat
                    },
                    "selfInfo": {
                        "location": {
                            "city": "北京",
                            "province": "北京",
                            "street": "信息路"
                        }
                    }
                },
                "userInfo": {
                    "apiKey": "2b6c6eb246924848848ea42304fba659",
                    "userId": "d8c55ecbeda9f0b3"
                }
        });
        ctx.body = { res: res.data.results[0].values.text };
        ```
+ 服务端部署：
    + 安装node.js
    + 安装Mongodb
    + 