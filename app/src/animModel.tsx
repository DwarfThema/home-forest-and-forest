import { useAnimations, useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AnimationAction,
  AnimationClip,
  Bone,
  Object3D,
  SkinnedMesh,
} from "three";
import { SkeletonUtils } from "three-stdlib";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function AnimModel({
  name,
  src,
  armatureName = "",
  boneName = "",
  speed = 1,
}: {
  name?: string;
  src: string;
  armatureName: string;
  boneName: string;
  speed?: number;
}) {
  const { scene, animations } = useGLTF(src) as GLTF;
  const skeleton = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(skeleton) as any;

  const { ref, actions, names } = useAnimations(animations);

  const armature = nodes?.[armatureName] as Object3D;
  const objSkinnedMesh = nodes?.[armatureName]?.children[0] as SkinnedMesh;
  const objBone = nodes?.[boneName] as Bone;

  useEffect(() => {
    actions[armatureName]?.setEffectiveTimeScale(speed).play();
  }, [actions, names]);

  return (
    <group position={armature?.position} ref={ref as any} dispose={null}>
      {objBone ? <primitive object={objBone} /> : null}
      <skinnedMesh
        geometry={objSkinnedMesh?.geometry}
        material={objSkinnedMesh?.material}
        skeleton={objSkinnedMesh?.skeleton}
        receiveShadow
        castShadow
      />
    </group>
  );
}
