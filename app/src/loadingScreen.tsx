import { useProgress } from "@react-three/drei";
import Image from "next/image";
import { useEffect, useState } from "react";
import Supporter from "../../public/textures/Supporter.png";
import logo from "../../public/textures/Loading_Logo.png";
import logoVer from "../../public/textures/Loading_Logo_Ver.png";
import house from "../../public/textures/loading_house.png";
import star from "../../public/textures/loading_star.png";
import Link from "next/link";

export default function LoadingScreen() {
  const { progress, loaded } = useProgress();
  const [loading, setLoading] = useState(false);
  const [transitionEnd, setTransitionEnd] = useState(false);

  const [loadingPercent, setLoadingPercent] = useState(0);

  const [houseRotate, setHouseRoate] = useState(true);

  useEffect(() => {
    if (loaded >= 68) {
      setLoading(true);
      setTimeout(() => {
        setTransitionEnd(true);
      }, 5500);
    }
  }, [progress, loaded]);

  useEffect(() => {
    setLoadingPercent(Math.floor((loaded / 68) * 100));
  }, [loaded]);

  useEffect(() => {
    setTimeout(() => {
      if (houseRotate) {
        setHouseRoate(false);
      } else {
        setHouseRoate(true);
      }
    }, 700);
  }, [houseRotate]);

  return (
    <div
      className={clsstail(
        "transition-opacity ease-in-out duration-[2000ms] absolute bg-[#FF8BC6] w-screen h-screen flex flex-col justify-center items-center text-[#ffffff] ",
        loading ? "opacity-0" : "opacity-100",
        transitionEnd ? "-z-10 hidden" : "z-20"
      )}
    >
      <div className="flex flex-col items-center justify-center w-4/6 h-full">
        <div className=" w-[1200px] h-[500px] flex justify-center items-center">
          <Image
            src={logo}
            className="absolute w-[1100px] zero:hidden lg:flex"
            alt="logo"
          />
          <Image
            src={logoVer}
            className="absolute w-[400px] zero:flex lg:hidden"
            alt="logo"
          />
          <Image
            src={house}
            className={`absolute lg:w-[110px] lg:mb-[420px] lg:mr-[710px] 
            zero:w-[70px] zero:mb-[460px] zero:mr-[155px]           ${
              houseRotate ? "rotate-6" : "-rotate-6"
            } transform-gpu`}
            alt="house"
          />
          <Image
            src={star}
            className="absolute lg:w-[110px] lg:mt-[420px] lg:ml-[900px]
            zero:w-[70px] zero:mt-[260px] zero:ml-[300px]
             animate-spin"
            alt="star"
          />
        </div>
        <div className="flex flex-col-reverse justify-end items-center">
          <Link
            href="https://www.vivlepark.com"
            className="lg:w-[500px] zero:w-[400px] mt-[130px] "
            target="_blank"
          >
            <Image src={Supporter} alt="support" />
          </Link>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-5 bg-[#02954d]`}
        style={{ width: `${loadingPercent}%` }}
      />
    </div>
  );
}

function clsstail(...classnames: string[]) {
  return classnames.join(" ");
}
// [1,2,3] = join("/") => "1/2/3"
