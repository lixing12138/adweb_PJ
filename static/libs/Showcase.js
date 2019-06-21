const KEY_UP = 107;
const KEY_DOWN = 109;

class Showcase {
    //展示平台的构造函数
    constructor(renderer, domElement) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.position = [0, 0, 0];
        this.controls = null;
        this.ambient = null;
        this.controlLight = null;
        this.renderer = renderer;
        this.pointLight = null;
        this.init();
    }

    //初始化场景等
    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0a0a0);
        this.ambient = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambient);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    //按键监听
    onKeyDown(event) {
        if (!showing)
            return;
        //点光源强度变化
        if (event.shiftKey) {
            switch (event.keyCode) {
                case KEY_UP:
                    this.pointLight.intensity = this.pointLight.intensity + 0.1;
                    break;
                case KEY_DOWN:
                    this.pointLight.intensity = this.pointLight.intensity - 0.1;
                    if (this.pointLight.intensity < 0)
                        this.pointLight.intensity = 0;
                    break;
            }
            return;
        }
        //环境光强度变化
        switch (event.keyCode) {
            case KEY_UP:
                this.ambient.intensity = this.ambient.intensity + 0.1;
                break;
            case KEY_DOWN:
                this.ambient.intensity = this.ambient.intensity - 0.1;
                if (this.ambient.intensity < 0)
                    this.ambient.intensity = 0;
                break;
        }
    }

    //展示模型
    show(model, index) {
        this.model = model;
        //调整模型z轴位置
        if (this.model.name < 6) {
            this.model.position.z = -(this.model.name - 1) * 800 - 400;
        } else {
            this.model.position.z = -(this.model.name - 6) * 800 - 400;
        }
        if (this.model.name > 10)
            this.model.position.z = -2075;
        //调整模型x轴位置
        if (index !== 1) {
            this.model.position.x = this.model.name > 5 ? 400 : -400;
        } else {
            this.model.position.x = this.model.name > 5 ? 570 : -570;
            if (this.model.name === 11)
                this.model.position.x = -100;
            if (this.model.name === 12)
                this.model.position.x = 100;
            this.model.position.y = -200;
        }

        this.scene.remove(this.pointLight);
        this.scene.add(this.model);
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.set(200, 200, 200);
        this.pointLight = getBulb(200, 200, 200, 5, 1, 2000, "0xffffff");
        this.scene.add(this.pointLight);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
        this.controlLight = new THREE.OrbitControls(this.pointLight, this.renderer.domElement);
        this.controlLight.update();
        document.getElementById("title").innerText = data[index][this.model.name]["title"];
        document.getElementById("content").innerText = data[index][this.model.name]["content"];
    }

    //清除模型
    delete() {
        this.controls.dispose();
        this.scene.remove(this.model);
        this.model.position.set(0, 0, 0);
        document.getElementById("title").innerText = "";
        document.getElementById("content").innerText = "";
        return this.model;
    }

}