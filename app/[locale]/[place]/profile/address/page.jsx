"use client"

import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import MyMap from "../_components/map";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { getURL } from "next/dist/shared/lib/utils";
import { usePathname } from "next/navigation";

export const mapArray = [
  {
    id: 1,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "6-podezd",
  },
  {
    id: 2,
    title: "Mega Planet",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.367297,
    longitude: 69.291109,
    comment: "",
  },
  {
    id: 3,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "Dom orqasidan kirasiz",
  },
  {
    id: 4,
    title: "Дом 1",
    adress: "Яшнабадский рй. Боткина 1а",
    latitude: 41.36507,
    longitude: 69.3074687,
    comment: "",
  },
];

const Adress = () => {
  const allT = useTranslations("All");
  const profileT = useTranslations("Profile");
  const pathName = usePathname();

  return (
    <Container className={"flex flex-col pt-3 md:pt-8 gap-5"}>
      <div className="w-full flex justify-between">
        <h1 className="w-full font-semibold text-primary textNormal4 text-start">
          {profileT("my_address")}
        </h1>
        <Link href={`${getURL(pathName)}/add-address`} className="h-10 px-4 bg-primary">

        {profileT("btnAddAddress")}
        </Link>
      </div>
      <div className="w-full hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {mapArray.map((item, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="w-full overflow-hidden min-w-[266px] h-[180px] rounded-2xl relative">
                <MyMap latitude={item.latitude} longitude={item.longitude} />
                <div className="h-full w-full absolute top-0 z-20"></div>
              </div>
              <CardTitle className={"textSmall3 font-bold"}>
                {item.title}
              </CardTitle>
              <CardDescription
                className={"text-[#2E2E2E] textSmall2 font-semibold"}
              >
                {item.adress}
              </CardDescription>
            </CardHeader>
            <CardFooter
              className={
                "grid grid-cols-1 gap-y-4  w-full gap-x-2"
              }
            >
              <Button className={"hover:bg-primary"}>{allT("delete")}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="lg:hidden w-full mx-2"
      >
        <CarouselContent>
          {mapArray.map((item, i) => (
            <CarouselItem key={i} className="basis-80 md:basis-auto ">
              <div className="p-1">
                <Card key={i}>
                  <CardHeader>
                    <div className="w-full lg:w-[266px] h-[180px] rounded-2xl relative">
                      {/* <MyMap
                        latitude={item.latitude}
                        longitude={item.longitude}
                      /> */}
                      <div className="h-full w-full absolute top-0"></div>
                    </div>
                    <CardTitle className={"text-xl font-bold"}>
                      {item.title}
                    </CardTitle>
                    <CardDescription
                      className={"text-[#2E2E2E] text-sm font-semibold"}
                    >
                      {item.adress}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter
                    className={
                      "grid grid-cols-1 gap-y-4 lg:grid-cols-2 w-full gap-x-2"
                    }
                  >
                    <Button className={"hover:bg-primary"}>Изменить</Button>
                    <Button className={"hover:bg-primary"}>Удалить</Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Adress;
