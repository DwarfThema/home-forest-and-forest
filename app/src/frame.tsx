import { Gltf, MeshPortalMaterial, useCursor } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { easing, geometry } from "maath";
import { DoubleSide } from "three";
import { useRoute, useLocation } from "wouter";

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
  const portal = useRef() as any;
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame((state, dt) =>
    easing.damp(portal.current, "blend", params?.id === id ? 1 : 0, 0.2, dt)
  );
  const [, params] = useRoute("/:id");
  const [, setLocation] = useLocation();

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
            <Gltf
              src="/models/plant.gltf"
              position={[0, -1, 0]}
              castShadow
              receiveShadow
            />
          </Suspense>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
