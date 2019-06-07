const KEY_UP = 107;
const KEY_DOWN = 109;

class Showcase {
    constructor(renderer, domElement) {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.position = [0, 0, 0];
        this.controls = null;
        this.ambient = null;
        this.renderer = renderer;
        this.init();
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.set(200, 200, 200);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0a0a0);
        this.ambient = new THREE.AmbientLight(0xffffff, 2);
        this.scene.add(this.ambient);
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }

    onKeyDown(event){
        if(!showing)
            return;
        switch (event.keyCode) {
            case KEY_UP:
                this.ambient.intensity = this.ambient.intensity + 0.1;
                break;
            case KEY_DOWN:
                this.ambient.intensity = this.ambient.intensity - 0.1;
                if(this.ambient.intensity<0)
                    this.ambient.intensity = 0;
                break;
        }
    }
    show(model, index) {
        this.model = model;
        //调整模型z轴位置
        if(this.model.name<6){
            this.model.position.z = -(this.model.name-1)*800-400;
        }else {
            this.model.position.z = -(this.model.name-6)*800-400;
        }
        if(this.model.name>10)
            this.model.position.z = -2075;
        //调整模型x轴位置
        if(index!==1){
            this.model.position.x = this.model.name>5?400:-400;
        }else {
            this.model.position.x = this.model.name>5?570:-570;
            if(this.model.name===11)
                this.model.position.x = -100;
            if(this.model.name===12)
                this.model.position.x = 100;
            this.model.position.y = -200;
        }


        this.scene.add(this.model);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
        document.getElementById("title").innerText = data[index][this.model.name]["title"];
        document.getElementById("content").innerText = data[index][this.model.name]["content"];
    }

    delete() {
        this.controls.dispose();
        this.scene.remove(this.model);
        this.model.position.set(0, 0, 0);
        document.getElementById("title").innerText = "";
        document.getElementById("content").innerText = "";
        return this.model;
    }

}