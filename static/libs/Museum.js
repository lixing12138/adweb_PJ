let loader = new THREE.GLTFLoader();
let flylights = ["", "", "", "", "", "", "", ""];//浮动灯光
let scenesGroup = ["", "", "", "", ""]; //五个场景
var mixers = [];
let mixer;
let playSpeed = 1.5;

class Museum {

    constructor() {
        this.index = 0;

        this.animationId = 0; //每个场景均所使用的动画id记录量
        this.house = new THREE.Object3D(); //博物馆主体
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xaaaaaa);
        this.scene.background = new THREE.CubeTextureLoader().setPath('resources/skybox/').load(
            [
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ]
        );
        let colors = [0xff0040, 0x80ff80, 0x00ffff, 0xcc3299, 0x236b8e, 0xffecae, 0x236b8e, 0x70db9e];


        for (let i = 0; i < 8; i++) {
            let position = getRandomPosition();
            flylights[i] = getBulb(position[0], position[1], position[2], 2, 6, 80, colors[i]);
        }
        setInterval(function () {
            for (let i = 0; i < 8; i++) {
                let position = getRandomPosition();
                flylights[i].position.set(position[0], position[1], position[2]);
            }

        }, 3000);
        const VIEW_ANGLE = 45,
            ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
            NEAR = 0.3,
            FAR = 5000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.lookAt(new THREE.Vector3(0, 15, 0));
        this.scene.add(this.camera);
        this.nameNPC = null;
        this.fpc = new FirstPersonControls(this.camera, this.scene);
        this.fpc.connect();
        this.scene.add(this.fpc.yawObject);

    }

    makeHelper() {
        this.arrowFloat = 0.05; //辅助箭头浮动幅度
        let dir = new THREE.Vector3(0, -10, 0);
        // 规格化方向向量(转换为长度为1的向量)
        dir.normalize();
        // 箭头开始的点
        let origin = new THREE.Vector3(0, 10, 0);
        // 箭头的长度。默认值为1
        let length = 1;
        // 用于定义颜色的十六进制值。默认值为0xffff00
        let hex = 0xffff00;
        // 箭头的长度。默认值为0.2 *length
        let headLength = 8;
        // 箭头宽度的长度。默认值为0.2 * headLength。
        let headWidth = 6;
        this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth); //辅助箭头
        this.scene.add(this.arrowHelper);
    }

    initMuseum() {
        this.makeHelper();
        //创建博物馆主体房子
        const wallTextTure = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/wallfloor.jpg')
        });
        const skyTextTure = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/skyfloor.jpg')
        });
        for (let i = 0; i < 20; i++) {
            let z = 75 + 200 * i;
            let left = getWall(30, 200, 600, -815, 270, z, wallTextTure);
            let right = getWall(30, 200, 600, 815, 270, z, wallTextTure);
            for (let j = 0; j < 4; j++) {
                let top = getWall(405, 201, 10, -607.5 + 405 * j, 570, z, skyTextTure);
                this.house.add(top);
            }
            this.house.add(left);
            this.house.add(right);
        }
        //添加浮动灯光
        for (let i = 0; i < 8; i++) {
            this.house.add(flylights[i]);
        }
        scenesGroup[0] = new THREE.Object3D();
        this.initFirst();
        this.changeNPC();
        this.changeVideo();
        this.scene.add(scenesGroup[0]);
        this.scene.add(this.nameNPC);
    }

    //博物馆外
    initFirst() {
        let materialGrass = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('/resources/floor/grass.jpg')
        });
        let mapPlane = new THREE.PlaneGeometry(4000, 4000, 4, 4);
        let meshPlane = new THREE.Mesh(mapPlane, materialGrass);
        meshPlane.position.set(0, -1, 0);
        meshPlane.rotation.set(-0.5 * Math.PI, 0, 0);
        scenesGroup[0].add(meshPlane);

        const light = new THREE.AmbientLight(0xaaaaaa);
        scenesGroup[0].add(light);
        loader.load("/resources/museum/scene.gltf", function (mesh) {
            mesh.scene.scale.set(160, 160, 160);
            mesh.scene.position.set(0, 0, -780);
            scenesGroup[0].add(mesh.scene);
        });
    }

    //容器厅 器
    initSecond() {
        const secondFloor = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/secondFloor.jpg')
        });
        //添加灯泡
        for (let i = 0; i < 20; i++) {
            let z = 75 + 200 * i;
            for (let j = 0; j < 4; j++) {
                let x = 100 + 200 * j;
                let leftFloor = getWall(200, 200, 10, -x, -6, z, secondFloor);
                let rightFloor = getWall(200, 200, 10, x, -6, z, secondFloor);
                scenesGroup[1].add(leftFloor);
                scenesGroup[1].add(rightFloor);
            }
            let leftBulb = getBulb(-800, 270, z, 8, 0.2, 2000, 0xffaa00);
            let rightBulb = getBulb(780, 270, z, 8, 0.2, 2000, 0xffaa00);
            scenesGroup[1].add(leftBulb);
            scenesGroup[1].add(rightBulb);
        }
        //添加玻璃盒
        for (let i = 0; i < 5; i++) {
            let z = 375 + i * 800;
            scenesGroup[1].add(getGlass(400, 100, z, 200, 200, 200, 0.1, 0xffaa00));
            scenesGroup[1].add(getGlass(-400, 100, z, 200, 200, 200, 0.1, 0xffaa00));
        }
        //添加容器
        this.getContainer(10, '/resources/container/bowl/scene.gltf', 400, 5, 375, 1);
        this.getContainer(0.5, '/resources/container/cup/scene.gltf', 400, 15, 1175, 2);
        this.getContainer(6, '/resources/container/jar/scene.gltf', 400, 20, 1975, 3);
        this.getContainer(40, '/resources/container/flagon/scene.gltf', 400, 50, 2775, 4);
        this.getContainer(5, '/resources/container/jug/scene.gltf', 400, 20, 3575, 5);
        this.getContainer(4, '/resources/container/kelin/scene.gltf', -400, 50, 375, 6);
        this.getContainer(40, '/resources/container/kettle/scene.gltf', -400, 50, 1175, 7);
        this.getContainer(5, '/resources/container/plate/scene.gltf', -400, 20, 1975, 8);
        this.getContainer(40, '/resources/container/pot/scene.gltf', -400, 40, 2775, 9);
        this.getContainer(1, '/resources/container/vase/scene.gltf', -400, 20, 3575, 10);
    }

    getContainer(scale, path, x, y, z, name) {
        loader.load(path, function (mesh) {
            mesh.scene.scale.set(scale, scale, scale);
            mesh.scene.position.set(x, y, z);
            let object = new THREE.Object3D();
            object.name = name;
            object.add(mesh.scene);
            scenesGroup[1].add(object);
            //照亮容器的聚光灯
            let spotLight = new THREE.SpotLight(0xffaa00, 25, 460, Math.PI / 4);
            spotLight.position.set(x, y + 400, z);
            spotLight.target = mesh.scene;
            scenesGroup[1].add(spotLight);
        });
    }

    //名画厅 画
    initThird() {
        //third_scene
        let rotation = Math.PI / 2;
        //添加灯光
        let light1 = getLightBoard(0xd98719, 10, 3800, 40, -10, 245, 2075);
        let light2 = getLightBoard(0xd98719, 10, 3800, 40, 10, 245, 2075);
        light1.rotateY(Math.PI / 2);
        light1.rotateX(-Math.PI * 2 / 3);
        light2.rotateY(-Math.PI / 2);
        light2.rotateX(-Math.PI * 2 / 3);
        scenesGroup[2].add(light1);
        scenesGroup[2].add(light2);
        const thirdFloor = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/thirdFloor.jpg')
        });
        for (let i = 0; i < 20; i++) {
            let z = 75 + 200 * i;
            for (let j = 0; j < 4; j++) {
                let x = 100 + 200 * j;
                let leftFloor = getWall(200, 200, 10, -x, -6, z, thirdFloor);
                let rightFloor = getWall(200, 200, 10, x, -6, z, thirdFloor);
                scenesGroup[2].add(leftFloor);
                scenesGroup[2].add(rightFloor);
            }
        }
        //添加灯泡
        for (let i = 0; i < 5; i++) {
            let z = 480 + 760 * i;
            scenesGroup[2].add(getBulb(-20, 230, z, 8, 3.2, 400, 0xd98719));
            scenesGroup[2].add(getBulb(0, 235, z, 8, 3.2, 400, 0xd98719));
        }
        scenesGroup[2].add(getBulb(400, 550, 2975, 40, 0.5, 4000, 0xd98719));
        scenesGroup[2].add(getBulb(400, 550, 975, 40, 0.5, 4000, 0xd98719));
        scenesGroup[2].add(getBulb(-400, 550, 2975, 40, 0.5, 4000, 0xd98719));
        scenesGroup[2].add(getBulb(-400, 550, 975, 40, 0.5, 4000, 0xd98719));
        scenesGroup[2].add(getWall(10, 3800, 250, 0, 125, 2075, null));
        //添加画作
        this.getPainting(3558, 220, '/resources/paintings/Qing.jpg', 6, 125, 2075, rotation, 11);
        this.getPainting(3787, 150, '/resources/paintings/Qian.jpg', -6, 125, 2075, -rotation, 12);
        this.getPainting(190, 150, '/resources/paintings/Athens.jpg', 797, 150, 375, -rotation, 1);
        this.getPainting(170, 140, '/resources/paintings/De.jpg', 797, 150, 1175, -rotation, 2);
        this.getPainting(190, 90, '/resources/paintings/Guernica.jpg', 797, 150, 1975, -rotation, 3);
        this.getPainting(120, 80, '/resources/paintings/Land.jpg', 797, 150, 2775, -rotation, 4);
        this.getPainting(145, 215, '/resources/paintings/Mona.jpg', 797, 150, 3575, -rotation, 5);
        this.getPainting(153, 102, '/resources/paintings/Gleaners.jpg', -797, 150, 375, rotation, 6);
        this.getPainting(160, 100, '/resources/paintings/Adma.jpg', -797, 150, 1175, rotation, 7);
        this.getPainting(190, 110, '/resources/paintings/Supper.jpg', -797, 150, 1975, rotation, 8);
        this.getPainting(190, 150, '/resources/paintings/Night.jpg', -797, 150, 2775, rotation, 9);
        this.getPainting(150, 110, '/resources/paintings/Sunday.jpg', -797, 150, 3575, rotation, 10);
    }

    getPainting(width, height, path, x, y, z, rotationY, name) {
        let materialPicture = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(path)
        });
        let object = new THREE.Object3D();
        const goldFloor = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/goldFloor.jpg')
        });
        object.add(getWall(5, width + 6, height + 6, x, y, z, goldFloor));
        x = x > 0 ? x - 5 : x + 5;
        object.name = name;
        if (name > 10)
            x = x > 0 ? x + 10 : x - 10;
        let picturePlane = new THREE.PlaneGeometry(width, height, 4, 4);
        let meshPicture = new THREE.Mesh(picturePlane, materialPicture);
        meshPicture.position.set(x, y, z);
        meshPicture.receiveShadow = true;
        meshPicture.rotation.set(Math.PI, rotationY, 0);
        object.add(meshPicture);
        scenesGroup[2].add(object);
    }

    //兵器厅 兵
    initForth() {
        //forth_scene
        scenesGroup[3].add(getBulb(0, 550, 2975, 50, 0.8, 4000, 0x4f4f2f));
        scenesGroup[3].add(getBulb(0, 550, 975, 50, 0.8, 4000, 0x4f4f2f));
        scenesGroup[3].add(new THREE.AmbientLight(0x4f4f2f, 1));
        const forthFloor = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('/resources/floor/forthFloor.jpg')
        });
        //添加地板
        for (let i = 0; i < 20; i++) {
            let z = 75 + 200 * i;
            for (let j = 0; j < 4; j++) {
                let x = 100 + 200 * j;
                let leftFloor = getWall(200, 200, 10, -x, -6, z, forthFloor);
                let rightFloor = getWall(200, 200, 10, x, -6, z, forthFloor);
                scenesGroup[3].add(leftFloor);
                scenesGroup[3].add(rightFloor);
            }
        }
        //添加玻璃盒
        for (let i = 0; i < 5; i++) {
            let z = 375 + i * 800;
            scenesGroup[3].add(getGlass(400, 100, z, 200, 200, 200, 0.2, 0x4f4f2f));
            scenesGroup[3].add(getGlass(-400, 100, z, 200, 200, 200, 0.2, 0x4f4f2f));
        }
        //添加兵器
        this.getWeapon(32, '/resources/weapon/axe/scene.gltf', 400, 70, 375, 1);
        this.getWeapon(0.05, '/resources/weapon/boomerang/scene.gltf', 400, 70, 1175, 2);
        this.getWeapon(1, '/resources/weapon/shield/scene.gltf', 450, 70, 1975, 200, 3);
        this.getWeapon(3, '/resources/weapon/crossbow/scene.gltf', 400, 30, 2775, 4);
        this.getWeapon(12, '/resources/weapon/halberd/scene.gltf', 400, 80, 3575, 5);
        this.getWeapon(20, '/resources/weapon/knife/scene.gltf', -400, 70, 375, 6);
        this.getWeapon(12, '/resources/weapon/lance/scene.gltf', -400, 50, 1175, 7);
        this.getWeapon(40, '/resources/weapon/spear/scene.gltf', -400, 50, 1975, 8);
        this.getWeapon(0.8, '/resources/weapon/stick/scene.gltf', -420, 50, 2655, 9);
        this.getWeapon(12, '/resources/weapon/sword/scene.gltf', -400, 70, 3575, 10);
    }

    getWeapon(scale, path, x, y, z, name) {
        loader.load(path, function (mesh) {
            mesh.scene.scale.set(scale, scale, scale);
            mesh.scene.position.set(x, y, z);
            let object = new THREE.Object3D();
            object.name = name;
            object.add(mesh.scene);
            scenesGroup[3].add(object);
        });
    }

    //饰品厅 饰
    initFifth() {
        let mirror = getMirror(1600, 4000, 0, -1, 1975);
        mirror.rotateX(-Math.PI / 2);
        scenesGroup[4].add(mirror);
        //fifth_scene
        const light = new THREE.AmbientLight(0xdddddd, 0.4);
        scenesGroup[4].add(light);
        //添加地板
        for (let i = 0; i < 20; i++) {
            let z = 75 + 200 * i;
            for (let j = 0; j < 4; j++) {
                let x = 100 + 200 * j;
                let leftFloor = getWall(200, 200, 10, -x, -7, z, null);
                let rightFloor = getWall(200, 200, 10, x, -7, z, null);
                scenesGroup[4].add(leftFloor);
                scenesGroup[4].add(rightFloor);
            }
        }
        //添加灯光
        for (let i = 0; i < 5; i++) {
            let z = 375 + 800 * i;
            let lightLeft = getLightBoard(0xdddddd, 40, 20, 20, 400, 20, z);
            let lightRight = getLightBoard(0xdddddd, 40, 20, 20, -400, 20, z);
            lightLeft.rotateX(Math.PI / 2);
            lightRight.rotateX(Math.PI / 2);
            scenesGroup[4].add(lightLeft);
            scenesGroup[4].add(lightRight);
            scenesGroup[4].add((getWall(20, 20, 20, 400, 9.5, z)));
            scenesGroup[4].add((getWall(20, 20, 20, -400, 9.5, z)));
            // scenesGroup[4].add((getBulb(390, 50, z, 8, 0.4, 100, 0xdddddd)));
            // scenesGroup[4].add((getBulb(-410, 50, z, 8, 0.4, 100, 0xdddddd)));
            scenesGroup[4].add(getLine(-400, 51, z, 0xdddddd, -400, 590, z));
            scenesGroup[4].add(getLine(400, 51, z, 0xdddddd, 400, 590, z));
        }
        //添加饰品
        this.getTreasure(0.05, '/resources/treasure/ankh/scene.gltf', 400, 20, 375, 1);
        this.getTreasure(4, '/resources/treasure/bracelet/scene.gltf', 400, 24, 1175, 2);
        this.getTreasure(80, '/resources/treasure/eardrop/scene.gltf', 400, 18, 1975, 3);
        this.getTreasure(0.5, '/resources/treasure/green/scene.gltf', 380, 25, 2790, 4);
        this.getTreasure(12, '/resources/treasure/jade/scene.gltf', 400, 23, 3575, 5);
        this.getTreasure(50, '/resources/treasure/necklace/scene.gltf', -400, -55, 375, 6);
        this.getTreasure(50, '/resources/treasure/rabbit/scene.gltf', -400, 20, 1175, 7);
        this.getTreasure(2, '/resources/treasure/red/scene.gltf', -400, 25, 1975, 8);
        this.getTreasure(0.12, '/resources/treasure/ring/scene.gltf', -400, 23, 2775, 9);
        this.getTreasure(0.02, '/resources/treasure/white/scene.gltf', -400, 29, 3575, 10);
    }

    getTreasure(scale, path, x, y, z, name) {
        loader.load(path, function (mesh) {
            mesh.scene.scale.set(scale, scale, scale);
            mesh.scene.position.set(x, y, z);
            let object = new THREE.Object3D();
            object.name = name;
            object.add(mesh.scene);
            scenesGroup[4].add(object);
        });
    }

    changeVideo() {
        let video = document.getElementById('video');
        video.pause();
        video.src = videoSrc[this.index.toString()];
        // alert(video.src);
        video.play();

        var parameters = {
            color: 0xffffff,
            map: new THREE.VideoTexture(video)
        };
        let videoMaterial = new THREE.MeshLambertMaterial(parameters);
        if (this.index === 0) {
            let operationGeo = new THREE.CubeGeometry(250, 74, 250);
            let operationMesh = new THREE.Mesh(operationGeo, videoMaterial);
            operationMesh.position.set(-500, 37, 0);
            scenesGroup[0].add(operationMesh);
            return;
        }
        let backward = null;
        let title = description[this.index.toString()]["title"];
        let content = description[this.index.toString()]["content"];
        while (backward === null)
            backward = getWall(1600, 30, 600, 0, 270, -40, getText(title, content));
        scenesGroup[this.index].add(backward);
        let forward = null;
        while (forward === null)
            forward = getWall(1600, 30, 600, 0, 270, 3990, videoMaterial);
        scenesGroup[this.index].add(forward);
    }

    changeNPC() {
        for (let i = 0; i < mixers.length; i++) { // 重复播放动画
            mixers[i].stopAllAction();
        }
        mixers = [];
        if (mixer != null) {
            mixer.stopAllAction();
            mixer = null;
        }
        switch (this.index) {
            case 0:
                this.nameNPC = new THREE.Sprite(getName("牛牛", "欢迎图腾"));
                this.nameNPC.position.set(-500, 100, 0);
                break;
            case 1:
                //添加商人
                playSpeed = 1.5;
                loader.load("/resources/role/first/scene.gltf", function (mesh) {
                    mesh.scene.scale.set(1, 1, 1);
                    mesh.scene.position.set(300, 0, 1500);
                    scenesGroup[1].add(mesh.scene);
                    mixer = new THREE.AnimationMixer(mesh.scene);
                    mixer.clipAction(mesh.animations[0]).setDuration(1).play();
                    mixers.push(mixer)
                });
                this.nameNPC = new THREE.Sprite(getName("道恩", "容器小贩"));
                this.nameNPC.position.set(300, 130, 1500);
                break;
            case 2:
                //添加答题者
                playSpeed = 6;
                loader.load("/resources/role/second/scene.gltf", function (mesh) {
                    mesh.scene.scale.set(0.3, 0.3, 0.3);
                    mesh.scene.position.set(-350, 0, 150);
                    mesh.scene.rotateY(Math.PI / 3);
                    scenesGroup[2].add(mesh.scene);
                    mixer = new THREE.AnimationMixer(mesh.scene);
                    mixer.clipAction(mesh.animations[0]).setDuration(1).play();
                    mixers.push(mixer)
                });
                this.nameNPC = new THREE.Sprite(getName("陆奇", "知识大师"));
                this.nameNPC.position.set(-350, 60, 150);
                break;
            case 3:
                //添加练功者
                playSpeed = 30;
                loader.load("/resources/role/third/scene.gltf", function (mesh) {
                    mesh.scene.scale.set(0.7, 0.7, 0.7);
                    mesh.scene.position.set(-300, 130, 3800);
                    mesh.scene.rotateY(Math.PI);
                    scenesGroup[3].add(mesh.scene);
                    mixer = new THREE.AnimationMixer(mesh.scene);
                    mixer.clipAction(mesh.animations[0]).setDuration(1).play();
                    mixers.push(mixer)
                });
                this.nameNPC = new THREE.Sprite(getName("欣欣", "兵器达人"));
                this.nameNPC.position.set(-300, 130, 3800);
                break;
            case 4:
                //添加警员
                playSpeed = 8;
                loader.load("/resources/role/forth/scene.gltf", function (mesh) {
                    mesh.scene.scale.set(30, 30, 30);
                    mesh.scene.position.set(750, 0, 1500);
                    mesh.scene.rotateY(-Math.PI / 2);
                    scenesGroup[4].add(mesh.scene);
                    mixer = new THREE.AnimationMixer(mesh.scene);
                    mixer.clipAction(mesh.animations[7]).setDuration(1).play();
                    mixers.push(mixer)
                });
                this.nameNPC = new THREE.Sprite(getName("杰克", "珠宝护卫"));
                this.nameNPC.position.set(750, 60, 1500);
                break;
        }
        this.nameNPC.scale.set(75, 37.5, 112.5);
    }

    //回退
    back() {
        cancelAnimationFrame(this.animationId);
        this.clearModel();
        if (this.index !== 4) {
            this.index++;
            this.clearModel();
            this.index--;
        }
        this.scene.remove(scenesGroup[this.index]);
        this.index--;
        //判断前一场景是否初始化
        if (scenesGroup[this.index] === null) {
            switch (this.index) {
                case 0:
                    scenesGroup[0] = new THREE.Object3D();
                    this.initFirst();
                    //离开博物馆，移除房子
                    this.scene.remove(this.house);
                    break;
                case 1:
                    scenesGroup[1] = new THREE.Object3D();
                    this.initSecond();
                    break;
                case 2:
                    scenesGroup[1] = new THREE.Object3D();
                    this.initThird();
                    break;
                case 3:
                    scenesGroup[2] = new THREE.Object3D();
                    this.initForth();
                    break;
            }
        }
        //更换NPC
        this.scene.remove(this.nameNPC);
        this.changeNPC();
        //更换场景，初始化下一场景
        this.scene.add(scenesGroup[this.index]);
        this.scene.add(this.nameNPC);
        this.changeVideo();
        switch (this.index) {
            case 0:
                scenesGroup[1] = new THREE.Object3D();
                this.initSecond();
                //离开博物馆，移除房子
                this.scene.remove(this.house);
                break;
            case 1:
                scenesGroup[0] = new THREE.Object3D();
                this.initFirst();
                break;
            case 2:
                scenesGroup[1] = new THREE.Object3D();
                this.initSecond();
                break;
            case 3:
                scenesGroup[2] = new THREE.Object3D();
                this.initThird();
                break;
        }
    }

    forward() {
        cancelAnimationFrame(this.animationId);
        this.clearModel();
        if (this.index !== 0) {
            this.index--;
            this.clearModel();
            this.index++;
        }
        this.scene.remove(scenesGroup[this.index]);
        this.index++;
        //更换NPC
        // this.scene.add(new THREE.Sprite(getName("牛牛","欢迎图腾")));
        this.scene.remove(this.nameNPC);
        this.changeNPC();
        this.scene.add(this.nameNPC);
        this.changeVideo();
        //更换场景，初始化下一场景
        this.scene.add(scenesGroup[this.index]);
        switch (this.index) {
            case 1:
                scenesGroup[2] = new THREE.Object3D();
                this.initThird();
                //进入博物馆，添加房子
                this.scene.add(this.house);
                break;
            case 2:
                scenesGroup[3] = new THREE.Object3D();
                this.initForth();
                break;
            case 3:
                scenesGroup[4] = new THREE.Object3D();
                this.initFifth();
                break;
            case 4:
                scenesGroup[3] = new THREE.Object3D();
                this.initForth();
                break;
        }
    }

    //清理不用的场景
    clearModel() {
        // 判断类型
        if (scenesGroup[this.index] instanceof THREE.Scene) {
            let children = scenesGroup[this.index].children;
            for (let i = 0; i < children.length; i++) {
                deleteGroup(children[i]);
                this.scene.remove(children[i]);
                children[i] = null;
            }
        } else {
            deleteGroup(scenesGroup[this.index]);
            this.scene.remove(scenesGroup[this.index]);
            scenesGroup[this.index] = null;
        }
        scenesGroup[this.index] = null;
        this.scene.remove(scenesGroup[this.index]);
    }


    getShowModel() {
        let length = scenesGroup[this.index].children.length;
        let findName = this.getName();
        for (let i = 0; i < length; i++) {
            if (!scenesGroup[this.index].children[i].hasOwnProperty("name"))
                continue;
            let name = scenesGroup[this.index].children[i].name;
            if (name === findName)
                return scenesGroup[this.index].children[i];
        }
    }

    getName() {
        let x = this.fpc.yawObject.position.x;
        let add = x > 0 ? 0 : 5;
        let base = parseInt((this.fpc.yawObject.position.z + 25) / 800) + 1 + add;
        if (this.index === 2 && Math.abs(x) < 400)
            base = x > 0 ? 11 : 12;
        return base;
    }

}