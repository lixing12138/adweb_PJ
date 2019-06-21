# 接口文档
## 问题模块：
### 获取问题：
+ url：```/question```
+ 方法：```GET```
+ 参数：无
+ 返回值：
    ```
    {
        data:{
            "id": "5cf5289b3204032b9c67ecd2",
            "question": 'question',
        }
    }
    ```
### 提交问题：
+ url：```/question```
+ 方法：```POST```
+ 参数：
    参数 | 描述
    ---|---
    id | 题目ID
    answer | 答案
+ 返回值：
    ```
    {
        "data":{
            "result":true,
            "tip":"",
        }
    }
    ```
### 聊天机器人：
+ url：```/chat```
+ 方法：```GET```
+ 参数：
    参数 | 描述
    ---|---
    chat | 聊天内容
+ 返回值：
    ```
    {
        "res":"content"
    }
    ```