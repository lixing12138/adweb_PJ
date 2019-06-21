//用于制作各种3D物品

//制作镜子
function getMirror(width, length, x, y, z) {
    var geometry = new THREE.PlaneBufferGeometry(width, length);
    var verticalMirror = new THREE.Reflector(geometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x889999,
        recursion: 1
    });
    verticalMirror.position.x = x;
    verticalMirror.position.y = y;
    verticalMirror.position.z = z;
    return verticalMirror;
}

//制作墙体
function getWall(width, length, height, x, y, z, material) {
    const wall = new THREE.CubeGeometry(width, height, length);
    if (material === null) {
        material = new THREE.MeshLambertMaterial({
            map: null
        });
    }
    let mesh = new THREE.Mesh(wall, material);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    return mesh;
}

//制作灯泡
function getBulb(x, y, z, size, intensity, distance, color) {
    var sphere = new THREE.SphereBufferGeometry(size, 16, 8);
    let lightBulb = new THREE.PointLight(color, intensity, distance);
    lightBulb.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        color: color
    })));
    lightBulb.position.set(x + 10, y + 4, z);
    return lightBulb;
}

//制作吊线
function getLine(x1, y1, z1, color, x2, y2, z2) {
    let lineGeometry = new THREE.Geometry(); //生成几何体
    lineGeometry.vertices.push(new THREE.Vector3(x1, y1, z1)); //线段的两个顶点
    lineGeometry.vertices.push(new THREE.Vector3(x2, y2, z2));
    let line = new THREE.Line(lineGeometry, new THREE.LineDashedMaterial({
        color: color, //线段的颜色
        dashSize: 1, //短划线的大小
        gapSize: 3 //短划线之间的距离
    }));
    line.computeLineDistances(); //线段显示为虚线
    return line;
}

//制作平板灯
function getLightBoard(color, intensity, width, height, x, y, z) {

    let rectLight = new THREE.RectAreaLight(color, intensity, width, height);
    rectLight.position.set(x, y, z);

    let rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({
        side: THREE.BackSide
    }));
    rectLightMesh.scale.x = rectLight.width;
    rectLightMesh.scale.y = rectLight.height;
    rectLight.add(rectLightMesh);

    let rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({
        color: 0x080808
    }));
    rectLightMesh.add(rectLightMeshBack);
    return rectLight;
}

//制作文字贴图
function getText(title, content) {
    var width = 1024, height = 512;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#C3C3C3';
    ctx.fillRect(0, 0, width, height);
    ctx.font = 50 + 'px " bold';
    ctx.fillStyle = '#2891FF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, width / 2, height / 3);
    ctx.fillText(content, width / 2, height / 2);
    let textTure = new THREE.MeshPhongMaterial({
        map: new THREE.CanvasTexture(canvas)
    });
    return textTure;
}

function getName(name,level){
    let width = 512, height = 256;
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'red';
    ctx.font = 40+'px " bold';
    ctx.fillText(level, width/3,height/3);
    ctx.fillStyle = 'rgba(65,195,80,0.78)';
    ctx.font = 30 + 'px " bold';
    ctx.textAlign = 'center';
    ctx.fillText(name, width/2,height/2);
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    //使用Sprite显示文字
    let material = new THREE.SpriteMaterial({map:texture});
    return material;
}

//制作玻璃
function getGlass(x, y, z, width, height, length, opacity, color) {
    let galssEnity = new THREE.BoxGeometry(width, height, length);
    let meshMaterial = new THREE.MeshBasicMaterial({
        color: color,
        opacity: opacity,
        transparent: true
    });
    let glass = new THREE.Mesh(galssEnity, meshMaterial);
    glass.position.set(x, y, z);
    return glass;
}

//产生随机位置
function getRandomPosition() {
    let position = [0, 0, 0];
    position[0] = Math.random() * 1580 - 790;
    position[1] = Math.random() * 580 + 10;
    position[2] = Math.random() * 3980 - 15;
    return position;
}

// 删除group，释放内存
function deleteGroup(group) {
    if (!group) return;
    // 删除掉所有的模型组内的mesh
    group.traverse(function (item) {
        if (item instanceof THREE.Mesh) {
            item.geometry.dispose(); // 删除几何体
            item.material.dispose(); // 删除材质
        }
    });
}