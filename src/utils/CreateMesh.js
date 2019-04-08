import * as THREE from 'three';

const vertexShader = `
#include <logdepthbuf_pars_vertex>
uniform float time;
varying vec4 modelpos;

void main(){
    modelpos =  vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #include <logdepthbuf_vertex>
}
`;

const fragmentShader = `
#include <logdepthbuf_pars_fragment>
uniform float time;
uniform vec2 resolution;
varying vec4 modelpos;

#define PI 3.14159
#define TWO_PI (PI*2.0)
#define N 68.5

void main(){
    #include <logdepthbuf_fragment>
    vec2 center = (modelpos.xy);
    center.x=-10.12*sin(time);
    center.y=-10.12*cos(time);
    vec2 v = (modelpos.xy) / min(resolution.y,resolution.x) * 45.0;
    v.x=v.x-10.0;
    v.y=v.y-200.0;
    float col = 0.0;

    for(float i = 0.0; i < N; i++){
        float a = i * (TWO_PI/N) * 61.95;
        col += cos(TWO_PI*(v.y * cos(a) + v.x * sin(a) + sin(time*0.004)*100.0 ));
    }

    col /= 5.0;
    gl_FragColor = vec4(col*1.0, -col*1.0,-col*4.0, 1.0);    
}
`;

function createMaterial(vShader, fShader) {
    let uniforms = {
        time: {type: 'f', value: 0.2},
        resolution: {type: "v2", value: new THREE.Vector2()},
    };

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;

    let meshMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    return meshMaterial;
}

let shadMat = createMaterial(vertexShader, fragmentShader);

function generateMesh(position) {
    let geom = new THREE.CylinderBufferGeometry(50, 20, 3, 8);
    //let risimat = new THREE.MeshBasicMaterial({ color: 0xff2142 });
    //let mesh = new THREE.Mesh(geom, risimat);
    let mesh = new THREE.Mesh(geom, shadMat);

    mesh.position.copy(position);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.rotateX(Math.PI / 2);

    // // update coordinate of the mesh
    mesh.updateMatrixWorld();
    return mesh;
}

function addMeshToScene(globeView) {
    let position = new THREE.Vector3(4203699.112252481, 180828.76359087773, 4777410.692429126);
    let mesh = generateMesh(position);
    globeView.scene.add(mesh);
    globeView.myObj = mesh;
    globeView.notifyChange(true);
}

export {addMeshToScene}