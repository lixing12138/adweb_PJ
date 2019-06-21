let chat = document.getElementById("chat");
let chatMany = document.getElementById("chatMany");
let chatLog = document.getElementById("chatLog");

class Chat {
    //展示平台的构造函数
    constructor() {
        this.canChat = false;
        this.chatModel = true; //true ：全体聊天  ; false : 私聊
    }

    //展示模型
    send() {
        let chatTarget = $("#userList").find("option:selected").text();
        let chatP = document.createElement("p");
        chatP.style.maxWidth = "250px";
        if (chatMany.value) { //聊天框内有内容
            this.chatModel = chatTarget === "all";
            if (this.chatModel) { //全体聊天
                chatP.innerHTML = "我：" + (chatMany.value || "");
                let userName = document.getElementById("getUserName").text; //获取用户名
                chatLog.appendChild(chatP);
                socket.emit('chatMany', {name: userName, message: chatMany.value});
            } else { //私聊

                chatP.innerHTML = "To " + chatTarget + ":" + chatMany.value;
                chatLog.appendChild(chatP);
                let userName = $("#getUserName").text(); //获取用户名
                let message = chatMany.value;
                let toId = $("#userList").val();
                socket.emit('chatOne', {from: userName, to: toId, message: message}); //发送消息给固定用户
            }
        }
        this.canChat = false;
        chat.style.display = "none";
        if (chatLog.children.length > 2) {
            chatLog.lastChild.scrollIntoView();
        }
    }

    //清除模型
    open() {

        if (chatLog.children.length > 2) {
            chatLog.lastChild.scrollIntoView();
        }
        // document.exitPointerLock();
        chat.style.display = "block";
        chatMany.focus();
        chatMany.value = "";
        this.canChat = true;
        if (chatLog.children.length > 2) {
            chatLog.lastChild.scrollIntoView();
        }
    }

}