"use client";

import StarsBg from "./src/starBg";
import Book from "./src/book";
import { Environment, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";

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

  return (
    <main className="w-screen h-screen bg-black">
      <div className="absolute z-20 m-10 w-20">
        {sequenceInt === 0 ? (
          <label className="bottom-56 left-1/2 z-20 flex cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer cursor-pointer"
              onClick={() => {
                bookRef.current.switchInput(isBookStyle);
                setBookStyle((prev) => !prev);
              }}
            />
            {isBookStyle ? (
              <Image
                src="/textures/pink.png"
                width={200}
                height={200}
                alt="coverStyle"
                className="cursor-pointer"
              />
            ) : (
              <Image
                src="/textures/green.png"
                width={200}
                height={200}
                alt="coverStyle"
                className="cursor-pointer"
              />
            )}
          </label>
        ) : (
          <button
            onClick={() => {
              bookRef.current.reverseBtn();
            }}
          >
            <Image
              src="/textures/backArrow.png"
              width={100}
              height={100}
              alt="back"
            />
          </button>
        )}
      </div>

      <Canvas shadows camera={{ fov: 40, position: [0, 0, 20], focus: 0 }}>
        <Environment preset="apartment" />
        <color attach="background" args={["#202130"]} />
        <fog attach="fog" args={["#202030", 10, 70]} />
        <Suspense fallback={null}>
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
        </Suspense>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={1.5}
            intensity={1}
          />
          <Vignette eskil={false} offset={0.01} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </main>
  );
}
