"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "use-intl";
import CustomImage from "../shared/customImage";
import LoveSvg from "@/public/assets/love";
import { Minus, Plus } from "lucide-react";

export default function FavoriteModal({ categories, locale }) {
  const all = useTranslations("All");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className=" flex justify-center items-center gap-1 text-white hover:text-primary text-sm font-medium bg-primary"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent
        mark="false"
        className="bg-background-primary rounded-sm px-3 max-md:w-11/12"
      >
        <DialogHeader className={"hidden"}>
          <DialogTitle className="textSmall3 text-primary">
            {all("favorites")}
          </DialogTitle>
          <DialogDescription className="hidden text-white text-[12px] ml-3"></DialogDescription>
        </DialogHeader>
        <main className="relative p-5 max-w-[700px] md:grid md:grid-cols-2 flex flex-col gap-5">
          <div className="cursor-pointer absolute top-0 right-0">
            {LoveSvg(true, 34, 36)}
          </div>
          <section className="w-full flex flex-col gap-3">
            <div className="w-full h-52 relative rounded-md overflow-hidden bg-secondary">
              <CustomImage
                src="/assets/images.png"
                alt="text"
                className={"w-full h-full object-cover"}
              />
            </div>
            <h1 className="textSmall1">
              <span className="">Входит в заказ :</span> Васаби Соевый соус
            </h1>
          </section>
          <section>
            <h1 className="textNormal">Филадельфия Classic</h1>
            <p className="textSmall">
              Нежный сливочный сыр, свежий огурец и благородный лосось.
              Воплощение всей тонкости и изящества вкуса в наилучшем своём
              исполнении в самом классическом ролле.
            </p>
            <h2 className="text-primary font-bold textNormal5">100 000 сум</h2>
          </section>
          <section className="flex justify-end items-center gap-5 col-span-2">
            <Button
              variant="ghost"
              className="border border-input bg-black/5 hover:bg-black/10 space-x-2"
            >
              <Plus />
              <span className="font-medium">1</span>
              <Minus />
            </Button>
            <Button className="w-40 hover:bg-primary-modal">
              {all("add")}
            </Button>
          </section>
        </main>
      </DialogContent>
    </Dialog>
  );
}
