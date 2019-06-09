const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
//xwl 聊天
const KEY_ENTER = 13;

const KTY_Space = 32;
//xwl 聊天
let showing;
let chat = document.getElementById("chat");
let chatMany = document.getElementById("chatMany");
let chatLog = document.getElementById("chatLog");


class FirstPersonControls {
    constructor(camera, scene, domElement) {
        //=========xiong
        //声明射线
        this.foreRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 30);
        this.rightRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 30);
        this.leftRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 30);
        this.backRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 30);

        this.scene = scene;
        this.domElement = domElement || document.body;
        this.isLocked = false;
        this.camera = camera;
        this.speed = 150;
        // 初始化移动状态
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.canChat = false;
        this.chatModel = true; //true ：全体聊天  ; false : 私聊

        this.clickHandler = this.domElement.requestPointerLock;
        this.onKeyDown = function(event) {
            if (this.canChat != true) {
                if (event.shiftKey)
                    this.speed = 300;
                switch (event.keyCode) {
                    case KEY_W:
                        this.moveForward = true;
                        break;
                    case KEY_A:
                        this.moveLeft = true;
                        break;
                    case KEY_S:
                        this.moveBackward = true;
                        break;
                    case KEY_D:
                        this.moveRight = true;
                        break;
                    case KTY_Space:
                        this.moveUp = true;
                        break;
                }
            }

        };
        this.onKeyUp = function(event) {
            switch (event.keyCode) {
                case KEY_W:
                    this.moveForward = false;
                    break;
                case KEY_A:
                    this.moveLeft = false;
                    break;
                case KEY_S:
                    this.moveBackward = false;
                    break;
                case KEY_D:
                    this.moveRight = false;
                    break;
                case KTY_Space:
                    this.moveUp = true;
                    break;
                    //xwl 多人聊天
                case KEY_ENTER:

                    if (this.canChat) {
                        let chatTarget = $("#userList").find("option:selected").text();

                        let chatP = document.createElement("p");
                        chatP.style.maxWidth = "250px";
                        if (chatMany.value) { //聊天框内有内容
                            if (chatTarget === "all") {
                                this.chatModel = true;
                            } else {
                                this.chatModel = false;
                            }
                            if (this.chatModel) { //全体聊天
                                chatP.innerHTML = "我：" + (chatMany.value || "");
                                let userName = document.getElementById("getUserName").text; //获取用户名
                                chatLog.appendChild(chatP);
                                socket.emit('chatMany', { name: userName, message: chatMany.value });
                            } else { //私聊

                                chatP.innerHTML = "To " + chatTarget + ":" + chatMany.value;
                                chatLog.appendChild(chatP);
                                let userName = $("#getUserName").text(); //获取用户名
                                let message = chatMany.value;
                                let toId = $("#userList").val();
                                socket.emit('chatOne', { from: userName, to: toId, message: message }); //发送消息给固定用户
                            }
                        }
                        this.canChat = false;
                        chat.style.display = "none";
                        if (!showing) {
                            this.domElement.requestPointerLock();
                            this.domElement.addEventListener('click', this.domElement.requestPointerLock);
                        }
                        if (chatLog.children.length > 2) {
                            chatLog.lastChild.scrollIntoView();
                        }
                    } else {
                        if (chatLog.children.length > 2) {
                            chatLog.lastChild.scrollIntoView();
                        }
                        document.exitPointerLock();
                        chat.style.display = "block";
                        chatMany.focus();
                        chatMany.value = "";
                        this.domElement.removeEventListener('click', this.domElement.requestPointerLock);
                        this.canChat = true;
                        if (chatLog.children.length > 2) {
                            chatLog.lastChild.scrollIntoView();
                        }
                    }
                    break;
            }
        };



        // 初始化camera, 将camera放在pitchObject正中央
        camera.rotation.set(0, 0, 0);
        camera.position.set(0, 20, 0);

        // 将camera添加到pitchObject, 使camera沿水平轴做旋转, 并提升pitchObject的相对高度
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);
        this.pitchObject.position.y = 20;

        // 将pitObject添加到yawObject, 使camera沿竖直轴旋转
        this.yawObject = new THREE.Object3D();
        this.yawObject.add(this.pitchObject);
        this.yawObject.position.z = 1000;
    }

    onPointerlockChange() {
        console.log(this.domElement);
        this.isLocked = document.pointerLockElement === this.domElement;
    }

    onPointerlockError() {
        console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
    }

    onMouseMove(event) {
        if (this.isLocked) {
            let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            this.yawObject.rotation.y -= movementX * 0.002;
            this.pitchObject.rotation.x -= movementY * 0.002;
            // 这一步的目的是什么
            this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
        }
    }

    update(delta) {

        // 确定移动方向
        let direction = new THREE.Vector3();
        direction.z = Number(this.moveBackward) - Number(this.moveForward);
        direction.x = Number(this.moveRight) - Number(this.moveLeft);
        direction.y = 0;

        // 移动方向向量归一化，使得实际移动的速度大小不受方向影响
        direction.normalize();
        //=====xiong
        let rotation = new THREE.Vector3(); //相机朝向
        rotation.copy(this.yawObject.getWorldDirection(new THREE.Vector3()).multiply(new THREE.Vector3(1, 0, 1)));
        //判断键盘按下的方向
        let m = new THREE.Matrix4();
        if (direction.z > 0) {
            if (direction.x > 0) {
                m.makeRotationY(Math.PI / 4);
            } else if (direction.x < 0) {
                m.makeRotationY(-Math.PI / 4);
            } else {
                m.makeRotationY(0);
            }
        } else if (direction.z < 0) {
            if (direction.x > 0) {
                m.makeRotationY(Math.PI / 4 * 3);
            } else if (direction.x < 0) {
                m.makeRotationY(-Math.PI / 4 * 3);
            } else {
                m.makeRotationY(Math.PI);
            }
        } else {
            if (direction.x > 0) {
                m.makeRotationY(Math.PI / 2);
            } else if (direction.x < 0) {
                m.makeRotationY(-Math.PI / 2);
            }
        }
        //给向量使用变换矩阵
        rotation.applyMatrix4(m);


        this.foreRaycaster.set(this.yawObject.position, rotation);
        rotation.X += Math.PI / 2;
        this.leftRaycaster.set(this.yawObject.position, rotation);
        rotation.X += Math.PI / 2;

        this.rightRaycaster.set(this.yawObject.position, rotation);
        rotation.X += Math.PI / 2;

        this.backRaycaster.set(this.yawObject.position, rotation);
        let children = [];
        let length = this.scene.children.length;
        for (let i = 0, j = 0; i < length; i++) {
            if (this.scene.children[i].name === "person")
                continue;
            children[j] = this.scene.children[i];
            j++;
        }
        let horizontalIntersections = this.foreRaycaster.intersectObjects(children, true);
        let horizontalIntersections1 = this.foreRaycaster.intersectObjects(children, true);
        let horizontalIntersections2 = this.foreRaycaster.intersectObjects(children, true);
        let horizontalIntersections3 = this.foreRaycaster.intersectObjects(children, true);

        let horOnObject = horizontalIntersections.length > 0 || horizontalIntersections1.lenght > 0 || horizontalIntersections2.length > 0 ||
            horizontalIntersections3.length > 0; //是否产生碰撞


        // 移动距离等于速度乘上间隔时间delta
        if (!horOnObject) {
            this.yawObject.translateZ(this.speed * direction.z * delta);
            this.yawObject.translateX(this.speed * direction.x * delta);
        }

        //=====xiong
        this.speed = 150;
    };

    removeLock() {
        this.domElement.removeEventListener('click', this.clickHandler);
    }

    addLock() {
        this.domElement.addEventListener('click', this.clickHandler);
    }

    connect() {
        //xwl 多人聊天
        this.domElement.addEventListener('click', this.clickHandler);
        // 在函数后面添加bind(this)的目的是什么
        document.addEventListener('pointerlockchange', this.onPointerlockChange.bind(this), false);
        document.addEventListener('pointerlockerror', this.onPointerlockError.bind(this), false);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

}