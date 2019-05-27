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
        this.model.position.z = -400;
        this.model.position.x = this.model.name>4?400:-400;

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