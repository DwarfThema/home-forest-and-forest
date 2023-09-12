import { Gltf } from "@react-three/drei";

export default function Sign() {
  return (
    <group name="sign">
      <Gltf src="/models/sign_base.gltf" castShadow receiveShadow />
      <Gltf
        src="/models/sign_home.gltf"
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
  );
}
