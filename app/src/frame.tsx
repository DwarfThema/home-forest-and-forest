import {
  MeshPortalMaterial,
  useAnimations,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { extend, useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { easing, geometry } from "maath";
import { AnimationAction, DoubleSide, SkinnedMesh } from "three";
import { useRoute, useLocation } from "wouter";
import { ScenePortal } from "./scenePortal";

extend(geometry);

export default function Frame({
  id = "world",
  doubleClick,
  ...props
}: {
  doubleClick: Function;
  id?: string;
  visible?: boolean;
  position?: any;
}) {
  const portal = useRef() as any;
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  const [_, params] = useRoute("/:id");
  const [, setLocation] = useLocation();

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
        <planeGeometry args={[0.5, 0.5, 2]} />
        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={DoubleSide}
        >
          <ScenePortal />
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
