const router = require('koa-router')();
const ObjectId = require('mongodb').ObjectId;
// 引入数据库模块
const DB = require('./module/db');
// 登录
router.get('/', async(ctx) => {
    await ctx.render('index');
}).post('/', async(ctx) => {
    ctx.session.name = ctx.request.body.name;
    const res = await DB.find('users', ctx.request.body);
    if (res.length === 0) {
        ctx.response.type = 'json';
        ctx.body = { result: false, message: '用户名密码错误' };
    } else {
        ctx.response.type = 'json';
        ctx.body = { result: true, message: '登录成功' };
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
        ctx.body = { result: false, message: '用户名重复', name: ctx.request.body.name }
    } else {
        const resRegister = await DB.insert('users', ctx.request.body);
        if (resRegister.result.ok) {
            ctx.body = { result: true, message: '注册成功', res: ctx.request.body };
        }

    }
});
// 场景
router.get('/scene', async(ctx) => {
    if (ctx.session.name) {
        const res = await DB.find('users', { name: ctx.session.name });
        await ctx.render('scene', { name: ctx.session.name, gender: res[0].gender, title: res[0].title, score: res[0].score });
    } else {
        ctx.redirect('/');
    }
});

// 个人信息
router.get('/detail', async(ctx) => {
    if (ctx.session.name) {
        const res = await DB.find('users', { name: ctx.session.name });
        await ctx.render('detail', { name: ctx.session.name, gender: res[0].gender, score: res[0].score });
    } else {
        ctx.redirect('/');
    }
}).post('/detail', async(ctx) => {
    console.log(ctx.request.body);
    if (ctx.session.name) {
        const res = await DB.find('users', { name: ctx.request.body.name });
        if (res.length === 0) {
            await DB.update('users', { name: ctx.session.name }, { $set: ctx.request.body });
            ctx.session.name = ctx.request.body.name || ctx.session.name;
            ctx.body = { result: true, message: "修改成功" }
        } else {
            ctx.body = { result: false, message: '用户名重复' }
        }
    } else {
        ctx.redirect('/');
    }
});

// 获取问题
router.get('/question', async(ctx) => {
    const res = await DB.random('question', [{ $sample: { size: 1 } }]);
    ctx.response.type = 'json';
    ctx.body = { data: res[0] };
}).post('/question', async(ctx) => {
    if (ctx.session.name) {
        const res = await DB.find('question', { "_id": ObjectId(ctx.request.body.id) });
        ctx.response.type = 'json';
        if (res[0].answer === ctx.request.body.answer) {
            await DB.update('users', { name: ctx.session.name }, { $inc: { 'score': 1 } });
            let score = await DB.find('users', { name: ctx.session.name });
            ctx.body = {
                data: { result: true, tip: '', score: score[0].score || 0 + 1 }
            }
        } else {
            let score = await DB.find('users', { name: ctx.session.name });
            ctx.body = { data: { result: false, tip: res[0].tip, score: score[0].score || 0 } }
        }
    } else {
        ctx.redirect('/');
    }

});

module.exports = router.routes();