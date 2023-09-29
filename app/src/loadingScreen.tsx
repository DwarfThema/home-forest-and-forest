import { Html, useProgress } from "@react-three/drei";

export default function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="absolute z-[30] bg-white w-screen h-screen">
        {progress} % loaded
      </div>
    </Html>
  );
}
