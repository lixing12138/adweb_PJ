# 前端说明
## 关键功能实现
+ <strong>注册功能：</strong>
用户提交信息，将数据保存到数据库。每条用户信息以id作为唯一标识，id由数据库自行生成。注册时会检测用户名称，若与已存在用户
名称相同，将无法注册。

+ <strong>登录功能：</strong>
用户提交信息，后端进行数据检测，如果用户名和密码匹配，则提示登陆成功，并路由跳转到场景页面；否则弹框提示错误信息

+ <strong>人物位置更新：</strong>
在每次渲染场景时，客户端会通过socket，将自己的位置信息发送到服务端，服务端将会把这些信息传给其他所有用户。每个用户都保存
有对应其他用户的模型，只需要将模型位置更新为服务端发送过来的新值，场景中对应的模型就自动移动到新位置。

+ <strong>用户信息修改：</strong>
用户可以修改个人信息，包括用户名、密码；如果修改密码，修改成功后将要求用户重新登录

+ <strong>场景切换：</strong>
展览馆场景主要是由Museum类构成，类内部包含多场景，多模型。场景数量共5个，每个场景实际上都是一个3DObject对象。每次更换时
需要的工作分为三部分：清除上一场景及其占用的内存；准备当前场景，并加载当前场景；预先准备下一个可能会加载的场景准备。清除
场景使用dispose，深度清理加载仅需add场景对象也就是3DObject对象，准备下一个场景则是依据当前场景序号，调用下一个场景的加载
函数即可

+ <strong>物品展示：</strong>
物品展示就是更换scene，并将需要展示的物品放入新场景即可。用户移动到相应物品前，按下打开展示面板，根据当前所处展馆以及人物
坐标，得到需要展示的模型名称，根据名称取得模型后，将模型发送给展示场景。展示场景是一个类，里面包含属性：展示对象，将展示
模型赋值给展示对象即可

## 附加功能实现

+ <strong>多人/单人聊天：</strong>
聊天是基于socketId来实现的。对于多人聊天，会触发多人聊天事件，前端将想要发送的消息发送到后台，后台将消息发送给每个用户；
对于单人聊天，前端触发单人聊天事件，将私聊对象的用户名发送给后台，后台根据用户名获取socketId，并根据socketId将消息发送给
对应的用户

+ <strong>智能系统助手：</strong>
智能系统助手同样位于聊天可选对象列表中，选择“智能小精灵”，就可以与小精灵对话了。前端判断对象为小精灵后，向后台发送get请
求，并附带用户聊天内容。后台获取内容后，调用图灵机器人接口，获取“回答内容”，并将内容发送给前端，前端展示信息即可

+ <strong>宠物更换：</strong>
每个用户都对应一个宠物，每个用户同样存储着其他用户的对应的宠物模型。当用户更换宠物后，将会触发宠物更换事件，向后台发送新
的宠物标识，后台将信息发送给其他用户，其他用户更具标识加载新的宠物模型，并更新该用户对应的宠物模型即可

+ <strong>答题机制：</strong>
在答题npc附近开始答题，每次会向后台请求一道题目，在提交答案时，将答题信息交给后台，后台判断答案正确性，并对用户分数做修
改。答题面板是由div元素组成，打卡面板仅需设置display为block即可，题目的信息存储在后台数据库中。

+ <strong>npc机制：</strong>
在场景中有多个npc，并且npc都具有特定动作，这是有模型本身自带的动画产生的效果。通过一般方式加载模型，模型的动画效果不会显
现，需要获取模型的AnimationMixer，之后将模型的这些动画放入数组中，随着时间进行update，既可以实现模型的动态效果了

+ <strong>大屏幕展示：</strong>
这里的大屏幕实际上是VideoTexture，这里需要使用html的一个元素——video元素。在加载每个场景的时候，会根据场景序号更换video
元素的src属性，将其更换为不同的视频。之后利用Three.js提供的VideoTexture，直接获得贴图，并将贴图加在几何体上即可

#项目文件说明
+ <strong>module文件夹：</strong>
封装的数据库模块，对数据库进行操作

+ <strong>node_module文件夹：</strong>
安装项目所需要的依赖

+ <strong>static文件夹：</strong>
项目需要的静态资源，其中libs文件夹包含需要的js库文件；resources文件夹存放项目使用的模型贴图等；另外还有一些css文件

+ <strong>views文件夹：</strong>
存放项目需要使用的html文件

+ <strong>app.js：</strong>
用于后台处理的js文件

+ <strong>route.js：</strong>
封装的路由模块

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
    + 安装依赖，执行指令：```npm install```
    + 启动程序，执行指令：```npm run start```