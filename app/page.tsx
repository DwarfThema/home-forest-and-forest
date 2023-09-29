"use client";

import StarsBg from "./src/starBg";
import Book from "./src/book";
import { Environment, Sparkles, Stats } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import LoadingScreen from "./src/loadingScreen";

export default function Home() {
  const positions = useMemo(() => {
    return [...Array(300)]
      .map(() => ({
        position: [
          40 - Math.random() * 100,
          40 - Math.random() * 100,
          40 - Math.random() * 100,
        ],
      }))
      .filter(
        (pos) =>
          (pos.position[0] < 0 || pos.position[0] > 5) &&
          (pos.position[1] < 0 || pos.position[1] > 5) &&
          (pos.position[2] < 0 || pos.position[2] > 5)
      );
  }, []);

  const bookRef = useRef() as any;
  const [isBookStyle, setBookStyle] = useState(true);
  const [sequenceInt, setSequenceInt] = useState(0);

  const [fov, setFov] = useState(40);
  const [btnSize, setBtnSize] = useState(200);
  const [backSize, setBackSize] = useState(100);

  useEffect(() => {
    if (isMobile) {
      setFov(55);
      setBtnSize(50);
      setBackSize(50);
    } else {
      setFov(40);
      setBtnSize(200);
      setBackSize(100);
    }
  }, [isMobile]);

  return (
    <main className="w-screen h-screen bg-white">
      <div className="absolute z-10 m-10 w-20">
        {sequenceInt === 0 ? (
          <button className="cursor-pointer">
            {isBookStyle ? (
              <Image
                src="/textures/pink.png"
                width={btnSize}
                height={btnSize}
                alt="coverStyle"
                className="cursor-pointer"
                onClick={() => {
                  bookRef.current.switchInput(isBookStyle);
                  setBookStyle((prev) => !prev);
                }}
              />
            ) : (
              <Image
                src="/textures/green.png"
                width={btnSize}
                height={btnSize}
                alt="coverStyle"
                className="cursor-pointer"
                onClick={() => {
                  bookRef.current.switchInput(isBookStyle);
                  setBookStyle((prev) => !prev);
                }}
              />
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              bookRef.current.reverseBtn();
            }}
          >
            <Image
              src="/textures/backArrow.png"
              width={backSize}
              height={backSize}
              alt="back"
              className="cursor-pointer"
            />
          </button>
        )}
      </div>

      <Canvas shadows camera={{ fov: fov, position: [0, 0, 20], focus: 0 }}>
        <Suspense fallback={<LoadingScreen />}>
          <Stats />
          <Environment preset="apartment" />
          <color attach="background" args={["#202130"]} />
          <fog attach="fog" args={["#202030", 10, 70]} />
          <Book
            ref={bookRef}
            sqeunceFn={(result: number) => {
              setSequenceInt(result);
            }}
          />
          <Sparkles
            count={200}
            scale={[20, 20, 10]}
            size={1}
            speed={0.5}
            color={"#ff9152"}
          />
          <Sparkles
            count={200}
            scale={[20, 20, 10]}
            size={1}
            speed={0.5}
            color={"#fffd8f"}
          />
          {positions.map((props, i) => (
            <StarsBg key={i} {...props} />
          ))}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.8}
              luminanceSmoothing={1.5}
              intensity={1}
            />
            <Vignette eskil={false} offset={0.01} darkness={0.75} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </main>
  );
}
