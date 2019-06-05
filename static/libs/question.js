let viewAnswer = document.getElementById("viewAnswer");
let viewNext = document.getElementById("viewNext");
let close = document.getElementById("close");

viewAnswer.addEventListener("click", getAnswer, false);
viewNext.addEventListener("click", getQuestion, false);
close.addEventListener("click", function() {
    //关闭页面，去除答题内容和答案
    document.getElementById("question").setAttribute("data-id", "");
    document.getElementById("answer").innerText = "";
    document.getElementById("detail").innerText = "";
    document.getElementById("questions").style.display = "none";
}, false);

function getAnswer() {
    let question = document.getElementById("question");
    let answer = document.getElementById("answer");
    let optionT = document.getElementById("optionT");
    let viewAnswer = document.getElementById("viewAnswer");
    $.ajax({
        url: '/question',
        method: 'post',
        data: {
            id: question.getAttribute("data-id"),
            answer: (optionT.checked) ? "T" : "F"
        },
        success: function(res) {
            let data = res.data;
            let result = data.result;
            let tip = data.tip;
            answer.innerText = "正确答案:" + result + "<br\>    " + tip;
            //请求成功禁止再次请求
            viewAnswer.removeEventListener("click", getAnswer);
        },
        err: function(err) {
            alert("答案提交出现问题");
            console.log(err);
        }
    });
}


function getQuestion() {
    let viewAnswer = document.getElementById("viewAnswer");
    let question = document.getElementById("question");
    let viewNext = document.getElementById("viewNext");
    document.getElementById("question").style.display = "block";
    $.ajax({
        url: '/question',
        method: 'get',
        success: function(res) { //返回数据，修改题目，清空答案，更新点击次数,允许获取答案。
            let dataCount = parseInt(question.getAttribute("data-count"));
            dataCount += 1;
            question.setAttribute("data-count", dataCount + ""); //更新点击次数
            let title = document.getElementById("question-title");
            title.innerText = "题目 " + dataCount + "/15";

            let data = res.data;
            question.setAttribute("data-id", data.id);
            document.getElementById("detail").innerText = data.question; //修改题目

            let answer = document.getElementById("answer");
            answer.innerText = ""; //清空答案

            //成功获取下一题，允许获取答案
            viewAnswer.addEventListener("click", getAnswer, false);
            if (dataCount === 15) { //获取15次后获取下一题消失，关闭界面按钮开启
                viewNext.style.display = "none";
                close.style.display = "block";
            }
        },
        err: function(err) {
            alert("获取下一题出现问题");
            console.log(err);
        }
    });
}