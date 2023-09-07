import {
  CameraControls,
  Html,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { extend, useFrame, useGraph, useThree } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimationAction,
  Group,
  LoopOnce,
  MathUtils,
  Scene,
  SkinnedMesh,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { SkeletonUtils } from "three-stdlib";
import { useControls } from "leva";
import { useRoute } from "wouter";
import { geometry } from "maath";
import Frame from "./frame";

extend(geometry);

/* 
sqeuenceInt 설명
0 : 책이 닫혀진 처음 상태
1 : 책이 열리고 있는 중인 상태
2 : 책이 모두 다 열린 상태
3 : 문이 열리고 있는 중인 상태
4 : 책이 닫히고 있을 때
 */

const Book = forwardRef(({ ...props }, ref) => {
  /*   const { ColorChange } = useControls({
    ColorChange: true,
  }); */

  const [camPos, setCamPos] = useState(new Vector3(-1.5, 2.5, 5));
  const [camFocus, setCamFocus] = useState(new Vector3(0.8, -0.3, 0));
  const [camSpeed, setCamSpeed] = useState<number>(20);

  const [isOpen, setIsOpen] = useState(false);

  //첫 번째 애니메이션 완료를 제어하기 위한 코드
  const [sqeuenceInt, setsqeuenceInt] = useState(0);
  const [currentActionState, setCurrentActionState] =
    useState<AnimationAction | null>(null);
  //*

  const [isDoorOpen, setDoorOpen] = useState(false);
  const [isPortalVisible, setPortalVisible] = useState(false);

  const [isBookColor, setBookColor] = useState<string>(
    "/models/book_rig_green.gltf"
  );

  const { scene, animations } = useGLTF(isBookColor);
  const baseRef = useRef<Group>(null);
  const bookGroupRef = useRef<Group>(null);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const bookMesh = nodes.Book_Paper as Group;
  //const bookMesh = nodes.Cube006 as SkinnedMesh;

  const { ref: animRef, actions, names } = useAnimations(animations);

  const meshs: SkinnedMesh[] = [];
  bookMesh.traverse((obj) => {
    if (obj instanceof SkinnedMesh) {
      meshs.push(obj);
    }
  });

  // MouseClick Interactive 함수
  const handleBaseRefClick = () => {
    setCamSpeed(3);
    if (sqeuenceInt === 0) {
      Open();
    } else if (sqeuenceInt === 2) {
      Door();
    }
  };
  //

  // Animation 함수
  const Open = () => {
    setsqeuenceInt(1);
    setIsOpen(true);
    if (actions[names[1]]) {
      const currentAction = actions[names[1]] as AnimationAction;
      setCurrentActionState(currentAction);
      currentAction.reset();
      currentAction.setLoop(LoopOnce, 1);
      currentAction.clampWhenFinished = true;
      currentAction.setEffectiveTimeScale(1.5);
      currentAction.play();
    }
  };

  const Door = () => {
    setDoorOpen(true);
    setPortalVisible(true);
    setsqeuenceInt(3);
    if (actions[names[0]]) {
      const currentAction = actions[names[0]] as AnimationAction;
      setCurrentActionState(currentAction);
      currentAction.reset();
      currentAction.setLoop(LoopOnce, 1);
      currentAction.clampWhenFinished = true;
      currentAction.setEffectiveTimeScale(1.5);
      currentAction.play();
    }
  };
  //

  const portalClick = (data: any) => {};

  useFrame((state) => {
    //카메라 쉐이크 관련 코드
    state.camera.position.x = MathUtils.lerp(
      state.camera.position.x,
      3 + state.mouse.x / 2,
      0.03
    );
    state.camera.position.y = MathUtils.lerp(
      state.camera.position.y,
      3 + state.mouse.y / 2,
      0.03
    );
    //*

    if (!isDoorOpen) {
      if (!isOpen) {
        setCamPos(new Vector3(-1.5, 2.5, 5));
        setCamFocus(new Vector3(0.8, -0.3, 0));
      }

      if (isOpen) {
        setCamPos(new Vector3(0, 1, 6.5));
        setCamFocus(new Vector3(-0.3, 0.3, 0));
      }
    }

    // 두번째 애니메이션 활성화를 위한 세팅
    if (
      currentActionState &&
      !currentActionState.isRunning() &&
      sqeuenceInt === 1
    ) {
      setsqeuenceInt(2);
    }

    if (
      currentActionState &&
      !currentActionState.isRunning() &&
      sqeuenceInt === 4
    ) {
      setsqeuenceInt(2);
    }

    // 두번째 애니메이션 실행뒤 카메라 무빙
    if (isDoorOpen) {
      setCamPos(new Vector3(-0.2, 0.1, 2));
      setCamFocus(new Vector3(-0.48, 0.42, -0.84));
    }
  });

  //reverseBtn 관련 코드
  const ReverseBookOpen = () => {
    setPortalVisible(false);

    const currentAction = actions[names[1]] as AnimationAction;
    setCurrentActionState(currentAction);
    currentAction.paused = false;
    currentAction.timeScale = -1.5;
    currentAction.setLoop(LoopOnce, 1);
    currentAction.play();
  };

  const ReverseDoorOpen = () => {
    const currentAction = actions[names[0]] as AnimationAction;
    setCurrentActionState(currentAction);
    currentAction.paused = false;
    currentAction.timeScale = -1.5;
    currentAction.setLoop(LoopOnce, 1);
    currentAction.play();
    setsqeuenceInt(4);
  };

  useImperativeHandle(ref, () => ({ reverseBtn, switchInput }));
  function reverseBtn() {
    if (sqeuenceInt === 2) {
      setsqeuenceInt(0);
      setIsOpen(false);
      ReverseBookOpen();
    } else if (sqeuenceInt === 3) {
      setDoorOpen(false);
      ReverseDoorOpen();
    }
  }

  function switchInput(isBookStyle: boolean) {
    if (isBookStyle === false) {
      setBookColor("/models/book_rig_green.gltf");
    } else {
      setBookColor("/models/book_rig_pink.gltf");
    }
  }

  return (
    <>
      <group
        {...props}
        ref={baseRef}
        position={[0, 0, 0]}
        rotation={[Math.PI / -0.56, Math.PI / 2.02, Math.PI / 0.52]}
        onClick={handleBaseRefClick}
      >
        <group ref={bookGroupRef}>
          <primitive object={nodes.BaseBone} ref={animRef} />
          <Frame
            visible={isPortalVisible ? true : false}
            position={[1.07, 0.2, -0.51]}
            scale={0.4}
            doubleClick={portalClick}
          />
          {meshs.map((mesh, index) => (
            <skinnedMesh
              key={index}
              geometry={mesh.geometry}
              material={mesh.material}
              skeleton={mesh.skeleton}
              receiveShadow
              castShadow
            />
          ))}
        </group>
      </group>
      <Rig position={camPos} focus={camFocus} camSpeed={camSpeed} />
    </>
  );
});

Book.displayName = "Book";

export default Book;

function Rig({
  position = new Vector3(0, 0, 0),
  focus = new Vector3(0, 0, 0),
  camSpeed,
}: {
  position?: Vector3;
  focus?: Vector3;
  camSpeed?: number;
}) {
  const { controls, scene } = useThree() as { controls: any; scene: Scene };
  const [, params] = useRoute("/:id");
  useEffect(() => {
    const enter = scene.getObjectByName(params?.id as string);
    if (enter) {
      enter?.parent?.localToWorld(position.set(1, -0.7, -2.2));
      enter?.parent?.localToWorld(focus.set(5, -0.7, -2.2));
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true);
  });

  return (
    <CameraControls
      makeDefault
      maxSpeed={camSpeed}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
    />
  );
}
