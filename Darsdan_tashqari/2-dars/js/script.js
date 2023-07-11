import * as THREE from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import IdleState from "./js/IdleState.js";
import RunState from "./js/RunState.js";
import WalkState from "./js/WalkState.js";
import DanceState from "./js/DanceState.js";
import BasicCharacterControllerInput from "./js/BasicCharacterControllerInput.js";
import BasicCharacterControllerProxy from "./js/BasicCharacterControllerProxy.js";
import Stats from "three/examples/jsm/libs/stats.module";
import "./base.css";

const basicPath = "./resources/zombie/";

class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    this._animations = {};
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this._animations)
    );

    this._LoadModels();
  }

  _LoadModels() {
    const loader = new FBXLoader();
    loader.load(
      require("./resources/zombie/mremireh_o_desbiens.fbx").default,
      (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.traverse((c) => {
          c.castShadow = true;
          c.receiveShadow = true;
        });

        this._target = fbx;
        this._params.scene.add(this._target);

        this._mixer = new THREE.AnimationMixer(this._target);

        this._manager = new THREE.LoadingManager();
        this._manager.onLoad = () => {
          this._stateMachine.SetState("idle");
        };

        const _OnLoad = (animName, anim) => {
          const clip = anim.animations[0];
          const action = this._mixer.clipAction(clip);

          this._animations[animName] = {
            clip: clip,
            action: action,
          };
        };

        const loader = new FBXLoader(this._manager);
        loader.load(require(basicPath + "walk.fbx").default, (a) => {
          _OnLoad("walk", a);
        });
        loader.load(require(basicPath + "run.fbx").default, (a) => {
          _OnLoad("run", a);
        });
        loader.load(require(basicPath + "idle.fbx").default, (a) => {
          _OnLoad("idle", a);
        });
        loader.load(require(basicPath + "dance.fbx").default, (a) => {
          _OnLoad("dance", a);
        });
      }
    );
  }

  Update(timeInSeconds) {
    if (!this._target) {
      return;
    }

    this._stateMachine.Update(timeInSeconds, this._input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this._decceleration.x,
      velocity.y * this._decceleration.y,
      velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(3.0);
    }

    if (
      this._stateMachine._currentState &&
      this._stateMachine._currentState.Name == "dance"
    ) {
      acc.multiplyScalar(0.0);
    }

    // TODO: follow camera here

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds * 1.5;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds * 1.5;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(
        _A,
        4.0 * Math.PI * timeInSeconds * this._acceleration.y
      );
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(
        _A,
        4.0 * -Math.PI * timeInSeconds * this._acceleration.y
      );
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
}

class FiniteStateMachine {
  constructor() {
    this._states = {};
    this._currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this._currentState) {
      this._currentState.Update(timeElapsed, input);
    }
  }
}

class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState("idle", IdleState);
    this._AddState("walk", WalkState);
    this._AddState("run", RunState);
    this._AddState("dance", DanceState);
  }
}

class CharacterControllerDemo {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);
    this._stats = Stats();
    document.body.appendChild(this._stats.dom);

    window.addEventListener(
      "resize",
      () => {
        this._OnWindowResize();
      },
      false
    );

    const fov = 45;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 10000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(0, 40, -80);
    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    const d = 500;
    light.shadow.camera.left = d;
    light.shadow.camera.right = -d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xffffff, 0.25);
    this._scene.add(light);

    const controls = new OrbitControls(this._camera, this._threejs.domElement);
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI * 0.5 - 0.1;
    controls.minDistance = 20;
    controls.maxDistance = 5000;
    controls.update();

    this._scene.background = new THREE.Color(0xcce0ff);
    this._scene.fog = new THREE.Fog(0xcce0ff, 1, 1000);

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      require("./resources/sky/posx.jpg").default,
      require("./resources/sky/negx.jpg").default,
      require("./resources/sky/posy.jpg").default,
      require("./resources/sky/negy.jpg").default,
      require("./resources/sky/posz.jpg").default,
      require("./resources/sky/negz.jpg").default,
    ]);
    texture.encoding = THREE.sRGBEncoding;
    this._scene.background = texture;

    const planetTexTure = new THREE.TextureLoader().load(require('./resources/g.jpg').default);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x006400,
        map: planetTexTure
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    const gt = new THREE.TextureLoader().load(
      require("./resources/g.jpg").default
    );
    const gg = new THREE.PlaneGeometry(10000, 10000);
    const gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

    const ground = new THREE.Mesh(gg, gm);
    ground.rotation.x = -Math.PI / 2;
    ground.material.map.repeat.set(512, 512);
    ground.material.map.wrapS = THREE.RepeatWrapping;
    ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.material.map.encoding = THREE.sRGBEncoding;
    // note that because the ground does not cast a shadow, .castShadow is left false
    ground.receiveShadow = true;

    this._scene.add(ground);
    this._LoadModel();

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 1000, 1000),
      new THREE.MeshBasicMaterial({ map: planetTexTure }));
    earth.receiveShadow = true;
    earth.position.set(0, -1000, 0)
    this._scene.add(earth);

    this._mixers = [];
    this._previousRAF = null;

    this._LoadAnimatedModel();
    this._RAF();
  }

  _LoadAnimatedModel() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    };
    this._controls = new BasicCharacterController(params);
  }

  _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
    const loader = new FBXLoader();
    loader.setPath(path);
    loader.load(modelFile, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse((c) => {
        c.castShadow = true;
      });
      fbx.position.copy(offset);

      const anim = new FBXLoader();
      anim.setPath(path);
      anim.load(animFile, (anim) => {
        const m = new THREE.AnimationMixer(fbx);
        this._mixers.push(m);
        const idle = m.clipAction(anim.animations[0]);
        idle.play();
      });
      this._scene.add(fbx);
    });
  }

  _LoadModel() {
    const FBXLoaderInstance = new FBXLoader();
    FBXLoaderInstance.load(
      require("./resources/tree.fbx").default,
      (object) => {
        object.traverse((c) => {
          c.castShadow = true;
          c.receiveShadow = true;
          // c.position.set(-10, 36, 30)
          // c.scale.set(0.1)
        });

        this.addTrees(object);
      },
      undefined,
      function (e) {
        console.error(e);
      }
    );
    console.log(this._treeModel);
  }

  addTrees(tree) {
    for (let i = 0; i < 1000; i++) {
      const cloneTree = tree.clone();
      cloneTree.rotation.y = Math.PI / (Math.random() * 2);
      cloneTree.scale.setScalar(Math.random() * 0.1 + 0.05);
      cloneTree.position.set(
        Math.random() * 10000 - 5000,
        0,
        Math.random() * 10000 - 5000
      );
      this._scene.add(cloneTree);
    }
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame((t) => {
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._RAF();
      this._stats.update();

      this._threejs.render(this._scene, this._camera);
      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });
  }

  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (this._mixers) {
      this._mixers.map((m) => m.update(timeElapsedS));
    }

    if (this._controls) {
      this._controls.Update(timeElapsedS);
    }
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new CharacterControllerDemo();
});