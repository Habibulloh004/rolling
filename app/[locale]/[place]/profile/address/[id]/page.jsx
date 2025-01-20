"use client";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pencil } from "@/public";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import MyMap from "../../_components/map";
import { map } from "../page";
import { Button } from "@/components/ui/button";

const EditAdress = ({ params }) => {
  const path = React.use(params);
  const addressT = useTranslations("Profile.Address");
  const allT = useTranslations("All");
  const address = map.find((item) => item.id == path.id);
  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="font-semibold textNormal4 text-primary w-full text-start">
        {addressT("title")}
      </h1>
      <div className="w-full flex flex-col lg:flex-row my-6 justify-around gap-16">
        <div className="w-full">
          <Label htmlFor="name" className={"text-base leading-6"}>
            {addressT("name")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="name"
              name="name"
              value={address?.title}
              type="text"
              onChange={(e) => console.log(e.target.value)}
              placeholder={addressT("name_pls")}
              className={
                "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
            <button>
              <Image
                src={pencil}
                alt=""
                width={100}
                height={20}
                className="h-5 w-4"
              />
            </button>
          </div>
          <Label htmlFor="address" className={"text-base leading-6"}>
            {addressT("address")}
          </Label>
          {/* <Input id="phone" disabled value="+998935204050" /> */}
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="address"
              value={address?.adress}
              name="address"
              type="text"
              placeholder={addressT("pls")}
              onChange={(e) => console.log(e)}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
            <button>
              <Image
                src={pencil}
                alt=""
                width={100}
                height={20}
                className="h-5 w-4"
              />
            </button>
          </div>
          <Label htmlFor="comment" className={"text-base leading-6"}>
            {addressT("comment")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="comment"
              value={address?.comment || "No Comment"}
              type="text"
              name="comment"
              onChange={(e) => console.log(e)}
              placeholder={addressT("name_pls")}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
            <button>
              <Image
                src={pencil}
                alt=""
                width={100}
                height={20}
                className="h-5 w-4"
              />
            </button>
          </div>
          <div className="w-full hidden lg:grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-2 mt-5 ">
            <Button className={"hover:bg-primary h-10 rounded-sm"}>
              {allT("edit")}
            </Button>
            <Button variant="ghost" className={"border-2 h-10 rounded-sm"}>
              {allT("delete")}
            </Button>
          </div>
        </div>
        <div className="lg:w-full h-48 lg:h-80 rounded-xl overflow-hidden">
          <MyMap latitude={address?.latitude} longitude={address?.longitude} />
        </div>
        <div className="w-full grid lg:hidden grid-cols-1 gap-y-2 mt-10">
          <Button className={"hover:bg-primary h-10 rounded-xl "}>
            {allT("edit")}
          </Button>
          <Button
            variant="ghost"
            className={"hover:bg-primary h-10 rounded-xl "}
          >
            {allT("delete")}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default EditAdress;
