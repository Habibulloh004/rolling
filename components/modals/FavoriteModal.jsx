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
import { posterUrl } from "@/lib/utils";
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
          {all("favorites")}
        </Button>
      </DialogTrigger>
      <DialogContent
        mark="false"
        className="bg-background-primary rounded-sm px-3"
      >
        <DialogHeader className={""}>
          <DialogTitle className="textSmall3 text-primary">
            {all("favorites")}
          </DialogTitle>
          <DialogDescription className="hidden text-white text-[12px] ml-3"></DialogDescription>
        </DialogHeader>
        <main className="space-y-2">
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((item, i) => {
              return <Card item={item} key={i} locale={locale} />;
            })}
          </section>
        </main>
      </DialogContent>
    </Dialog>
  );
}

const Card = ({ item, localizedName }) => {
  const [like, setLike] = React.useState(false);
  return (
    <div className="relative w-full bg-white rounded-md p-2 space-y-2">
      <div className="relative w-full aspect-square overflow-hidden bg-secondary rounded-sm">
        <CustomImage
          src={`${posterUrl}${item.category_photo}`}
          className="w-full h-full"
          alt={`${localizedName}`}
        />
        <div
          onClick={() => setLike(!like)}
          className="cursor-pointer absolute top-0 right-0"
        >
          {LoveSvg(true, 20, 24)}
        </div>
      </div>
      <div>
        <h1 className="textSmall1 font-bold">
          Филадельфия <span className="font-[400]">Classic</span>
        </h1>
        <p className="textSmall2 font-bold">100 000 сум</p>
      </div>
      <div className="flex justify-end items-center gap-2">
        <Button className="w-8 h-8 hover:bg-primary-modal">
          <Plus />
        </Button>
        {/* <Button className="px-1 h-8 hover:bg-primary-modal">
          <Plus />
          <span className="font-medium">1</span>
          <Minus />
        </Button> */}
      </div>
      {/* <h1 className="absolute left-0 top-3 textSmall2 px-2 py-1 bg-red-400 text-white font-medium rounded-r-md">
        15% Скидка
      </h1> */}
    </div>
  );
};
