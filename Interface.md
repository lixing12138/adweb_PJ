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
            "_id": "5cf5289b3204032b9c67ecd2",
            "question": 'question',
        }
    }
    ```
### 提交问题：
+ url：```/question```
+ 方法：```POST```
+ 参数
    参数 | 描述
    ---|---
    _id | 题目ID
    answer | 答案
    
    header 1 | header 2
    ---|---
    row 1 col 1 | row 1 col 2
    row 2 col 1 | row 2 col 2



+ 返回值：
    ```
    {
        "result":true,
        "tip":""
    }
    ```
