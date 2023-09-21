import { Float, Sparkles, useAnimations, useGLTF } from "@react-three/drei";
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
  SkinnedMesh,
  Vector3,
} from "three";
import { SkeletonUtils } from "three-stdlib";
import { geometry } from "maath";
import Frame from "./frame";
import Rig from "./rig";
import { ScenePortal } from "./scenePortal";
import { useControls } from "leva";

extend(geometry);

/* 
sqeuenceInt 설명
0 : 책이 닫혀진 처음 상태
1 : 책이 열리고 있는 중인 상태
2 : 책이 모두 다 열린 상태
3 : 문이 열리고 있는 중일 때
4 : 문이 닫히고 있을 때
5: 문이 다 열렸을 때 
6: 내부로 들어갔을 때
 */

const Book = forwardRef(
  ({ sqeunceFn, ...props }: { sqeunceFn: Function }, ref) => {
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

    /* book load function */

    const { scene, animations } = useGLTF(isBookColor);
    const bookGroupRef = useRef<Group>(null);

    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const bookMesh = nodes.Book_Paper as Group;

    const { ref: animRef, actions, names } = useAnimations(animations);
  
    const meshs: SkinnedMesh[] = [];
    bookMesh.traverse((obj) => {
      if (obj instanceof SkinnedMesh) {
        meshs.push(obj);
      }
    });

    // MouseClick Interactive Function
    const handleBaseRefClick = () => {
      setCamSpeed(3);
      if (sqeuenceInt === 0) {
        Open();
      } else if (sqeuenceInt === 2) {
        Door();
      }
    };
    //

    // Animation Function
    const Open = () => {
      setsqeuenceInt(1);
      sqeunceFn(1);
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
      sqeunceFn(3);
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

      // 애니메이션 진행중인 상태의 시퀀스 관리
      if (
        currentActionState &&
        !currentActionState.isRunning() &&
        sqeuenceInt === 1
      ) {
        setsqeuenceInt(2);
        sqeunceFn(2);
      }

      if (
        currentActionState &&
        !currentActionState.isRunning() &&
        sqeuenceInt === 4
      ) {
        setsqeuenceInt(2);
        sqeunceFn(2);
      }

      if (
        currentActionState &&
        !currentActionState.isRunning() &&
        sqeuenceInt === 3
      ) {
        setsqeuenceInt(5);
        sqeunceFn(5);
      }

      // 두번째 애니메이션 실행뒤 카메라 무빙
      if (isDoorOpen) {
        setCamPos(new Vector3(-0.2, 0.1, 2));
        setCamFocus(new Vector3(-0.48, 0.42, -0.84));
      }
    });

    /* reverse animation */
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
      setCamSpeed(3);
      setsqeuenceInt(4);

      sqeunceFn(4);
    };
    /////////////////////////////////

    /* Enter Portal Action */
    const [isEnterAction, setEnterAction] = useState(false);
    const [isEnter, setEnter] = useState(false);
    const [inAndOutMS, setInAndOutMS] = useState(1900);
    const [isOut, setOut] = useState(true);

    useEffect(() => {
      if (sqeuenceInt === 6) {
        setCamSpeed(1);
        setCamPos(new Vector3(-0.55, 0.45, -1.0));
        setCamFocus(new Vector3(-0.55, 0.8, -2.0));
      }
    });
    //////////////////////////////

    /* back btn function */
    useImperativeHandle(ref, () => ({ reverseBtn, switchInput }));
    function reverseBtn() {
      if (sqeuenceInt === 2) {
        setsqeuenceInt(0);
        sqeunceFn(0);
        setIsOpen(false);
        ReverseBookOpen();
      } else if (sqeuenceInt === 5 && !isEnterAction && isOut) {
        setDoorOpen(false);
        ReverseDoorOpen();
      } else if (sqeuenceInt === 6 && isEnter) {
        setEnterAction(true);
        setsqeuenceInt(5);
        setEnter(false);
        setTimeout(() => {
          setOut(true);
          setEnterAction(false);
        }, inAndOutMS + 3000);
      }
    }

    function switchInput(isBookStyle: boolean) {
      if (isBookStyle === false) {
        setBookColor("/models/book_rig_green.gltf");
      } else {
        setBookColor("/models/book_rig_pink.gltf");
      }
    }
    //////////////////////

    const { posx, posy, posz } = useControls({
      posx: { value: -1, step: 0.1 },
      posy: { value: -1.9, step: 0.1 },
      posz: { value: -7.3, step: 0.1 },
    });

    return (
      <>
        <group
          {...props}
          position={[0, -0.1, 0]}
          rotation={[Math.PI / -0.56, Math.PI / 2.02, Math.PI / 0.52]}
          onClick={handleBaseRefClick}
        >
          <Sparkles
            visible={isPortalVisible ? true : false}
            position={[0.9, 0.25, -0.53]}
            count={35}
            scale={0.1}
            size={1}
            speed={0.1}
            color={"#fffd8f"}
          />
          <Frame
            visible={isPortalVisible ? true : false}
            position={[1.07, 0.2, -0.53]}
            doubleClick={() => {
              if (sqeuenceInt !== 5 && isEnterAction) return;
              if (sqeuenceInt === 5) {
                setsqeuenceInt(6);
                setEnterAction(true);
                setTimeout(() => {
                  setEnterAction(false);
                  setEnter(true);
                  setOut(false);
                }, inAndOutMS);
              }
            }}
            isEnter={isEnter}
          >
            <group position={[posx, posy, posz]} name="innerObject">
              <ScenePortal />
            </group>
          </Frame>
          <group ref={bookGroupRef}>
            <primitive object={nodes.BaseBone} ref={animRef} />
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
  }
);

Book.displayName = "Book";

export default Book;
