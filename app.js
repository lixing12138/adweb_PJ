const Koa = require('koa');
const render = require('koa-art-template');
const path = require('path');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const app = new Koa();
// chat
const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
const port = 3003;


// 引入路由模块
const route = require('./route');
// 无效路由
app.use(async(ctx, next) => {
    await next();
    if (ctx.status == 404) {
        await ctx.render('404');
    }
});
// 配置模板
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});
// 配置Session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', //cookie key (default is koa:sess)
    maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true, //是否可以 overwrite (默认 default true)
    httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true, //签名默认 true
    rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
    renew: false, //(boolean) renew session when session is nearly expired,
};
app.use(session(CONFIG, app));
// post中间件
app.use(bodyParser());
// 静态资源
app.use(static(path.join(__dirname, 'static')));
// 路由
app.use(route);
// chat
let userMap = new Map();
//监听
io.on('connection', function(socket) {
    console.log('client ' + socket.id + ' connected');
    // login事件
    socket.on('login', function(data) {
        userMap.set(socket.id, data.name);
        io.sockets.emit('login', [...userMap]);
    });
    // 一对一聊天
    socket.on('chatOne', function(data) {
        io.to(data.to).emit('chatOne', { message: data.message, from: data.from });
    });
    // 一对多聊天
    socket.on('chatMany', function(data) {
        socket.broadcast.emit('chatMany', { name: userMap.get(socket.id), message: data.message });
    });
    // 更换外形
    socket.on('hat', function(data) {
        data.socketid = socket.id;
        socket.broadcast.emit('hat', data);
    });
    // 上线
    socket.on('player', function(data) {
        data.socketid = socket.id;
        socket.broadcast.emit('player', data);
    });
    // 离线
    socket.on('disconnect', function() {
        console.log('client ' + socket.id + ' disconnected');
        userMap.delete(socket.id);
        socket.broadcast.emit('offline', { socketid: socket.id });
    });
});
server.listen(process.env.PORT || port, () => {
    console.log(`app run at : http://127.0.0.1:${port}`);
});