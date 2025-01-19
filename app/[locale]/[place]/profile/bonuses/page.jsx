import Container from "@/components/shared/container";
import React from "react";
import TextBonus from "../_components/textBonus";
import Image from "next/image";
import { gold } from "@/public";

const Bonuses = () => {
  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="w-full textNormal4 text-primary font-semibold">Бонусы</h1>
      <div className="flex justify-around pt-6 w-full">
        <div className="flex flex-col items-center">
          <div className="bg-primary rounded-xl w-full max-w-md h-[240px] flex flex-col justify-between items-center relative py-[5px] ">
            <div className="flex flex-col items-center justify-center pt-5">
              <p className="font-bold text-white text-[32px] ">GOLD</p>
              <p className="font-bold text-white text-center text-2xl ">30%</p>
              <p className="font-bold text-white text-center text-[10px] ">
                Имеющиеся бонусы:
              </p>
              <p className="font-bold text-white text-center text-2xl ">
                45 000 сум
              </p>
            </div>
            <Image
              src={gold}
              alt="gold"
              width={400}
              height={100}
              className="absolute top-0 w-[350px] lg:w-[400px]"
            />
            <p className="font-bold text-white text-center text-[10px]  tracking-[0.12rem]">
              ROLLINGSUSHI
            </p>
          </div>
          <TextBonus className={"flex lg:hidden flex-col gap-5 pt-7 w-full"} />
          <p className="my-4 text-base font-medium">
            Чем чаще вы заказываете — тем больше ваша выгода!
          </p>
        </div>

        <TextBonus className={"hidden lg:flex flex-col gap-5"} />
      </div>
    </Container>
  );
};

export default Bonuses;
