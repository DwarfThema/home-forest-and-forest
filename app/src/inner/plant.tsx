import { useAnimations, useGLTF } from "@react-three/drei";
import { use, useEffect, useMemo } from "react";
import {
  AnimationAction,
  AnimationClip,
  Bone,
  Group,
  Object3D,
  Scene,
  SkinnedMesh,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Plant({ ...props }) {
  const gltf = useGLTF("/models/plant_anim.gltf") as any;
  const scene = gltf.scene as Group;
  const nodes = gltf.nodes as any;
  const animations = gltf.animations as AnimationClip[];

  const { ref: animRef, actions, names } = useAnimations(animations);
  const geometry = useMemo(() => nodes, []);

  const armatures: any[] = [
    {
      mesh: geometry.PinkTree_armature,
      bone: geometry.Bone_3,
    },
    { mesh: geometry.starTree_armature, bone: geometry.Bone },
    { mesh: geometry.tree_1_armature, bone: geometry.Bone_4 },
    { mesh: geometry.tree_2_armature, bone: geometry.Bone_5 },
    { mesh: geometry.tree_3_armature, bone: geometry.Bone_6 },
    { mesh: geometry.tree_4_armature, bone: geometry.Bone_2 },
    { mesh: geometry.tree_5_armature, bone: geometry.Bone_1 },
  ];

  console.log(actions);

  useEffect(() => {
    actions[names[0]]?.reset();
    actions[names[1]]?.reset();
    actions[names[2]]?.reset();
    actions[names[3]]?.reset();
    actions[names[4]]?.reset();
    actions[names[5]]?.reset();
    actions[names[6]]?.reset();

    actions[names[0]]?.setEffectiveTimeScale(1);
    actions[names[1]]?.setEffectiveTimeScale(1);
    actions[names[2]]?.setEffectiveTimeScale(1);
    actions[names[3]]?.setEffectiveTimeScale(1);
    actions[names[4]]?.setEffectiveTimeScale(1);
    actions[names[5]]?.setEffectiveTimeScale(1);
    actions[names[6]]?.setEffectiveTimeScale(1);

    actions[names[0]]?.play();
    actions[names[1]]?.play();
    actions[names[2]]?.play();
    actions[names[3]]?.play();
    actions[names[4]]?.play();
    actions[names[5]]?.play();
    actions[names[6]]?.play();
  }, [animRef]);

  console.log(animRef);

  return (
    <group>
      {armatures.map((obj, index) => {
        const objSkinnedMesh = obj.mesh.children[0] as SkinnedMesh;
        const objBone = obj.bone as Bone;

        return (
          <group key={index} position={obj.mesh.position} ref={animRef as any}>
            <primitive object={objBone} />
            <skinnedMesh
              geometry={objSkinnedMesh.geometry}
              material={objSkinnedMesh.material}
              skeleton={objSkinnedMesh.skeleton}
              receiveShadow
              castShadow
            />
          </group>
        );
      })}
    </group>
  );
}
