import { useControls } from "leva";
import { useEffect, useState } from "react";
import Sign from "./inner/sign";
import { Gltf } from "@react-three/drei";
import Elephant from "./inner/elephant";
import Plant from "./inner/plant";
import Statics from "./inner/statics";
import AnimModel from "./animModel";

export function ScenePortal() {
  const { groundColor } = useControls({
    /*     posx: { value: 0, step: 0.1 },
    posy: { value: 0, step: 0.1 },
    posz: { value: 0, step: 0.1 }, */
    groundColor: true,
  });
  const [groundName, setGroundName] = useState("/models/plant_ground_1.gltf");

  useEffect(() => {
    if (groundColor) {
      setGroundName("/models/plant_ground_1.gltf");
    } else {
      setGroundName("/models/plant_ground_2.gltf");
    }
  }, [groundColor]);

  return (
    <group position={[-2.5, -1.2, -6.0]} name="innerObject">
      <Sign />
      <Gltf src={groundName} />
      <group>
        <AnimModel
          armatureName="PinkTree_armature"
          boneName="Bone_3"
          speed={1}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="starTree_armature"
          boneName="Bone"
          speed={1.2}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="tree_1_armature"
          boneName="Bone_4"
          speed={0.8}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="tree_2_armature"
          boneName="Bone_5"
          speed={0.5}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="tree_3_armature"
          boneName="Bone_6"
          speed={0.95}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="tree_4_armature"
          boneName="Bone_2"
          speed={1.221}
          src="/models/plant_anim.gltf"
        />
        <AnimModel
          armatureName="tree_5_armature"
          boneName="Bone_1"
          speed={1.31221}
          src="/models/plant_anim.gltf"
        />
      </group>
      <Statics />
      <Elephant />
      {/* <Plant /> */}
    </group>
  );
}
