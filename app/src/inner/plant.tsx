import { useAnimations, useGLTF } from "@react-three/drei";
import { use, useEffect } from "react";
import { AnimationAction, Bone, Object3D, SkinnedMesh } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Plant({ ...props }) {
  const { scene, animations } = useGLTF("/models/plant_anim.gltf") as GLTF;
  const { ref: animRef, actions, names } = useAnimations(animations);

  const armatures: Object3D[] = [];
  scene.traverse((obj) => {
    if (obj.type === "Object3D") {
      armatures.push(obj);
    }
  });

  useEffect(() => {
    console.log(actions[0]);

    actions[0]?.reset();
    actions[1]?.reset();
    actions[2]?.reset();
    actions[3]?.reset();
    actions[4]?.reset();
    actions[5]?.reset();
    actions[6]?.reset();

    actions[0]?.setEffectiveTimeScale(1);
    actions[1]?.setEffectiveTimeScale(1);
    actions[2]?.setEffectiveTimeScale(1);
    actions[3]?.setEffectiveTimeScale(1);
    actions[4]?.setEffectiveTimeScale(1);
    actions[5]?.setEffectiveTimeScale(1);
    actions[6]?.setEffectiveTimeScale(1);

    actions[0]?.play();
    actions[1]?.play();
    actions[2]?.play();
    actions[3]?.play();
    actions[4]?.play();
    actions[5]?.play();
    actions[6]?.play();
  }, []);

  return (
    <group>
      {/*       {armatures.map((obj, index) => {
        const objBone = obj.children[1] as Bone;
        const objSkinnedMesh = obj.children[0] as SkinnedMesh;

        return (
          <group key={index} position={objBone?.position}>
            <primitive object={objBone} ref={animRef} />
            <skinnedMesh
              geometry={objSkinnedMesh.geometry}
              material={objSkinnedMesh.material}
              skeleton={objSkinnedMesh.skeleton}
              receiveShadow
              castShadow
            />
          </group>
        );
      })} */}
    </group>
  );
}
