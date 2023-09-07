import {
  Float,
  Gltf,
  MeshPortalMaterial,
  useAnimations,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { extend, useFrame, useGraph } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { easing, geometry } from "maath";
import {
  AnimationAction,
  AnimationMixer,
  DoubleSide,
  Group,
  Mesh,
  SkinnedMesh,
} from "three";
import { useRoute, useLocation } from "wouter";
import { useControls } from "leva";
import { useRouter } from "next/router";

extend(geometry);

export default function Frame({
  id = "world",
  bg = "#3cc297",
  width = 1,
  height = 1,
  doubleClick,
  ...props
}: {
  doubleClick: Function;
  id?: string;
  bg?: string;
  width?: number;
  height?: number;
  visible?: boolean;
  position?: any;
  scale?: number;
}) {
  const { posx, posy, posz } = useControls({
    posx: { value: 0, step: 0.1 },
    posy: { value: 0, step: 0.1 },
    posz: { value: 0, step: 0.1 },
  });

  const portal = useRef() as any;
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  const [_, params] = useRoute("/:id");
  const [, setLocation] = useLocation();

  const { scene: plantScene } = useGLTF("/models/plant.gltf");
  const { nodes: plantNodes } = useGraph(plantScene);

  const plantMesh = plantNodes.mesh as Group;

  const plantMeshes: Mesh[] = [];
  plantMesh.traverse((obj) => {
    if (obj instanceof Mesh) {
      plantMeshes.push(obj);
    }
  });

  const { scene: elephantScene, animations } = useGLTF("/models/elephant.gltf");
  const { nodes: elephnatNodes } = useGraph(elephantScene);
  const { ref: animRef, actions, names } = useAnimations(animations);

  const elephantMesh = elephnatNodes.elephantMesh as SkinnedMesh;

  useEffect(() => {
    if (actions[names[0]]) {
      const currentAction = actions[names[0]] as AnimationAction;
      console.log(currentAction);
      currentAction.reset();
      currentAction.setEffectiveTimeScale(1);
      currentAction.play();
    }
  }, [props.visible]);

  useFrame((state, dt) => {
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt);
  });
  ``;

  return (
    <group {...props}>
      <mesh
        name={id}
        onDoubleClick={(e) => (
          e.stopPropagation(), setLocation("/world"), doubleClick(true)
        )}
        onPointerOver={(e) => hover(true)}
        onPointerOut={() => hover(false)}
        rotation={[Math.PI * 1, Math.PI * 1.5, Math.PI * 1]}
      >
        <planeGeometry args={[width, height, 2]} />
        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={DoubleSide}
        >
          <color attach="background" args={[bg]} />
          <Suspense fallback={null}>
            <group position={[-2.5, -1.2, -6.0]}>
              <group>
                {plantMeshes.map((mesh, index) => {
                  if (mesh.name === "Ground" || mesh.name.includes("bush")) {
                    return (
                      <mesh
                        key={index}
                        geometry={mesh.geometry}
                        material={mesh.material}
                        position={mesh.position}
                        receiveShadow
                        castShadow
                      />
                    );
                  } else {
                    return (
                      <Float
                        key={index}
                        speed={1}
                        rotationIntensity={1}
                        floatIntensity={2}
                        floatingRange={[0, 0]}
                      >
                        <mesh
                          geometry={mesh.geometry}
                          material={mesh.material}
                          position={mesh.position}
                          receiveShadow
                          castShadow
                        />
                      </Float>
                    );
                  }
                })}
              </group>

              <group>
                <primitive object={elephnatNodes.Bone} ref={animRef} />
                <skinnedMesh
                  geometry={elephantMesh.geometry}
                  material={elephantMesh.material}
                  skeleton={elephantMesh.skeleton}
                  receiveShadow
                  castShadow
                />
              </group>
              <group>
                <Gltf src="/models/sign_base.gltf" castShadow receiveShadow />
                <Gltf
                  src="/models/sign_home.gltf"
                  castShadow
                  receiveShadow
                  onClick={() => {
                    var newWindow = window.open("about:blank") as Window;
                    if (newWindow) {
                      newWindow.location.href = "https://sillyday.kr/";
                    }
                  }}
                />
                <Gltf
                  src="/models/sign_sillyday.gltf"
                  castShadow
                  receiveShadow
                  onClick={() => {
                    var newWindow = window.open("about:blank") as Window;
                    if (newWindow) {
                      newWindow.location.href =
                        "https://www.instagram.com/sillyday.official/";
                    }
                  }}
                />
                <Gltf
                  src="/models/sign_sillysally.gltf"
                  castShadow
                  receiveShadow
                  onClick={() => {
                    var newWindow = window.open("about:blank") as Window;
                    if (newWindow) {
                      newWindow.location.href =
                        "https://www.instagram.com/sillysally.official/";
                    }
                  }}
                />
              </group>
            </group>
          </Suspense>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
