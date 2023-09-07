import {
  Gltf,
  MeshPortalMaterial,
  useAnimations,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { extend, useFrame, useGraph } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { easing, geometry } from "maath";
import { AnimationAction, AnimationMixer, DoubleSide, Mesh } from "three";
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
    posx: { value: -2.5, step: 0.1 },
    posy: { value: -1.2, step: 0.1 },
    posz: { value: -6.0, step: 0.1 },
  });

  const portal = useRef() as any;
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  const [_, params] = useRoute("/:id");
  const [, setLocation] = useLocation();

  const [currentActionState, setCurrentActionState] =
    useState<AnimationAction | null>(null);

  const { scene, animations } = useGLTF("/models/elephant.gltf");
  const { nodes } = useGraph(scene);

  const elephantMesh = nodes.elephant as Mesh;

  useFrame((state, dt) => {
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt);
  });

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
              <Gltf
                src="/models/plant.gltf"
                position={[0, -1, 0]}
                castShadow
                receiveShadow
              />
              <mesh
                geometry={elephantMesh.geometry}
                material={elephantMesh.material}
                position={[-0.7, -0.8, -0.6]}
                receiveShadow
                castShadow
              />
              <group position={[0, 0, 0]}>
                <Gltf
                  src="/models/sign_base.gltf"
                  position={[0, -1, 0]}
                  castShadow
                  receiveShadow
                />
                <Gltf
                  src="/models/sign_home.gltf"
                  position={[0, -1, 0]}
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
                  position={[0, -1, 0]}
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
                  position={[0, -1, 0]}
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
