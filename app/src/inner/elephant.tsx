import { useAnimations, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { AnimationAction, SkinnedMesh } from "three";

export default function Elephant({ ...props }) {
  const [src, setSrc] = useState("/models/elephant.gltf");
  const { nodes, animations } = useGLTF(src) as any;
  const geometry = useMemo(() => nodes, []);

  const { ref: animRef, actions, names } = useAnimations(animations);

  const elephantMesh = geometry.elephantMesh as SkinnedMesh;

  useEffect(() => {
    if (actions[names[0]]) {
      const currentAction = actions[names[0]] as AnimationAction;
      currentAction.reset();
      currentAction.setEffectiveTimeScale(1);
      currentAction.play();
    }
  }, []);

  return (
    <group dispose={null} ref={animRef as any}>
      <primitive object={geometry.Bone} />
      <skinnedMesh
        geometry={elephantMesh.geometry}
        material={elephantMesh.material}
        skeleton={elephantMesh.skeleton}
        receiveShadow
        castShadow
      />
    </group>
  );
}
