const router = require('koa-router')();
// 引入数据库模块
const DB = require('./module/db');
// 登录
router.get('/', async(ctx) => {
    await ctx.render('index');
}).post('/', async(ctx) => {
    ctx.session.name = ctx.request.body.name;
    const res = await DB.find('users', ctx.request.body);
    // console.log(res);
    if (res.length === 0) {
        ctx.response.type = 'json';
        ctx.body = { result: false, message: '用户名密码错误' };
    } else {
        ctx.response.type = 'json';
        ctx.response.body = { result: true, message: '登录成功' };
        // ctx.redirect('/scene');
    }
});
// 注册
router.get('/register', async(ctx) => {
    await ctx.render('register');
}).post('/register', async(ctx) => {
    const res = await DB.find('users', { name: ctx.request.body.name });
    ctx.response.type = 'json';
    if (res.length !== 0) {
        ctx.body = { result: false, message: '用户名重复' }
    } else {
        const resRegister = await DB.insert('users', ctx.request.body);
        if (resRegister.result.ok) {
            ctx.body = { result: true, message: '注册成功' }
        }

    }
});
// 场景
router.get('/scene', async(ctx) => {
    if (ctx.session.name) {
        await ctx.render('scene', { name: ctx.session.name });
    } else {
        ctx.redirect('/');
    }
});
// 获取问题
router.get('/question', async(ctx) => {
    const res = await DB.random('question', [{ $sample: { size: 15 } }]);
    console.log(res);
    ctx.body = { data: res };
}).post('/question', async(ctx) => {
    let score = ctx.request.body.score;
    let condition = ctx.request.body.res;


});

module.exports = router.routes();