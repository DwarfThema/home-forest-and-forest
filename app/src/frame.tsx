import { MeshPortalMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { easing, geometry } from "maath";

extend(geometry);

export default function Frame({
  id = "world",
  doubleClick,
  children,
  isEnter,
  ...props
}: {
  doubleClick: Function;
  id?: string;
  visible?: boolean;
  position?: any;
  isEnter?: boolean;
  children?: React.ReactNode;
}) {
  const portal = useRef() as any;

  useFrame((state, dt) => {
    easing.damp(portal.current, "blend", isEnter ? 1 : 0, 0.1, dt);
  });

  return (
    <group {...props}>
      <mesh
        name={id}
        onDoubleClick={(e) => (e.stopPropagation(), doubleClick(true))}
        rotation={[Math.PI * 1, Math.PI * 1.5, Math.PI * 1]}
      >
        <planeGeometry args={[0.34, 0.43, 1]} />
        <MeshPortalMaterial ref={portal} blur={0.8}>
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
