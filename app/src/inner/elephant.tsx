import { useAnimations, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useEffect } from "react";
import { AnimationAction, SkinnedMesh } from "three";

export default function Elephant({ ...props }) {
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

  return (
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
  );
}
