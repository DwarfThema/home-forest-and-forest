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
import Plant from "./inner/plant";
import Statics from "./inner/statics";
import Elephant from "./inner/elephant";
import Sign from "./inner/sign";

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
  const { groundColor } = useControls({
    /*     posx: { value: 0, step: 0.1 },
    posy: { value: 0, step: 0.1 },
    posz: { value: 0, step: 0.1 }, */
    groundColor: true,
  });

  const portal = useRef() as any;
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  const [_, params] = useRoute("/:id");
  const [, setLocation] = useLocation();

  useFrame((state, dt) => {
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt);
  });
  ``;

  const [groundName, setGroundName] = useState("");

  useEffect(() => {
    if (groundColor) {
      setGroundName("/models/plant_ground_1.gltf");
    } else {
      setGroundName("/models/plant_ground_2.gltf");
    }
  }, [groundColor]);

  const { scene: elephantScene, animations } = useGLTF("/models/elephant.gltf");
  const { nodes: elephnatNodes } = useGraph(elephantScene);
  const { ref: animRef, actions, names } = useAnimations(animations);

  const elephantMesh = elephnatNodes.elephantMesh as SkinnedMesh;

  useEffect(() => {
    if (actions[names[0]]) {
      const currentAction = actions[names[0]] as AnimationAction;
      currentAction.reset();
      currentAction.setEffectiveTimeScale(1);
      currentAction.play();
    }
  }, []);

  // space that need to erase
  const { scene: staticScene } = useGLTF("/models/plant.gltf");
  const { nodes: staticNodes } = useGraph(staticScene);

  const plantMesh = staticNodes.mesh as Group;

  const staticsMeshs: Mesh[] = [];
  plantMesh.traverse((obj) => {
    if (obj instanceof Mesh) {
      staticsMeshs.push(obj);
    }
  });
  // space that need to erase

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
            <group position={[-2.5, -1.2, -6.0]} name="innerObject">
              {/* <Statics /> */}
              <Sign />
              <Gltf src={groundName} />
              {/* <Plant /> */}

              <group>
                {staticsMeshs.map((mesh, index) => {
                  if (mesh.name.includes("bush")) {
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
                  } else if (mesh.name === "Ground") {
                    null;
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

              <group name="elephant">
                <primitive object={elephnatNodes?.Bone} ref={animRef} />
                <skinnedMesh
                  geometry={elephantMesh.geometry}
                  material={elephantMesh.material}
                  skeleton={elephantMesh.skeleton}
                  receiveShadow
                  castShadow
                />
              </group>
            </group>
          </Suspense>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
