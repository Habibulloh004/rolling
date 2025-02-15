"use client";

import * as React from "react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import CustomImage from "../shared/customImage";
import LoveSvg from "@/public/assets/love";

export function CategoryModal({ categories, locale }) {
  const all = useTranslations("All");

  // Assuming you want to display popular categories in the carousel
  const popularCategories = categories.filter((item) => item.isPopular); // Add `isPopular` or your desired condition

  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button aria-label={`category modal`}>Category modal</Button>
      </DialogTrigger>
      <DialogContent
        className="relative mx-auto max-sm:max-w-[calc(100vh-80px)] max-sm:w-11/12 max-sm:rounded-md px-3 bg-background-primary py-5 focus:outline-none"
        mark="false"
      >
        <DialogHeader>
          <DialogTitle className="textNormall text-start text-primary">
            {all("categories")}
          </DialogTitle>
          <DialogDescription className="hidden text-white text-[12px] ml-3"></DialogDescription>
        </DialogHeader>

        {/* Grid of categories */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            return (
              <Link
                locale={locale}
                key={i}
                href={`/category/${item.id}`} // Adjust link dynamically
                className="relative w-full flex justify-start items-center flex-col gap-2"
              >
                <div className="w-32 h-32 relative rounded-[40px] overflow-hidden">
                  <CustomImage
                    src={
                      item?.category_photo_origin
                        ? `${posterUrl}${item.category_photo_origin}`
                        : "/empty.jpg"
                    }
                    className="w-full h-full object-cover"
                    alt={`${localizedName}`}
                  />
                </div>
                <h1 className="font-bold textSmall2 text-thin text-center">
                  {localizedName}
                </h1>
              </Link>
            );
          })}
        </section>

        {/* Carousel for popular categories */}
        <section className="mt-5 space-y-3 pb-4">
          <div className="flex justify-between items-center gap-3">
            <h1 className="font-bold text-primary textNorma2 w-full">
              {all("popular")}
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  aria-label={`category more`}
                  variant="ghost"
                  className="p-0 flex justify-end items-center gap-1 text-primary hover:text-primary text-sm font-medium"
                >
                  {all("more")}
                  <ChevronRight size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent
                mark="false"
                className="bg-background-primary rounded-sm p-2"
              >
                <DialogHeader className={"pt-2"}>
                  <DialogTitle className="hidden textSmall3 text-primary"></DialogTitle>
                  <DialogDescription className="hidden text-white text-[12px] ml-3"></DialogDescription>
                </DialogHeader>
                <main className="space-y-2">
                  <section className="w-full flex justify-between items-center gap-2">
                    <h1 className="w-full textNormal1 text-primary font-bold">
                      {all("cold_rolls")}
                    </h1>
                    <Select className="w-auto">
                      <SelectTrigger className="">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </section>
                  <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categories.map((item, i) => {
                      return <Card item={item} key={i} locale={locale} />;
                    })}
                  </section>
                </main>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.slice(0, 4).map((item, i) => {
              return <Card item={item} key={i} locale={locale} />;
            })}
          </div>
        </section>
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
          src={
            item?.category_photo_origin
              ? `${posterUrl}${item.category_photo_origin}`
              : "/empty.jpg"
          }
          className="w-full h-full"
          alt={`${localizedName}`}
        />
        <div
          onClick={() => setLike(!like)}
          className="cursor-pointer absolute top-0 right-0"
        >
          {LoveSvg(like, 20, 24)}
        </div>
      </div>
      <div>
        <h1 className="textSmall1 font-bold">
          Филадельфия <span className="font-[400]">Classic</span>
        </h1>
        <p className="textSmall2 font-bold">100 000 сум</p>
      </div>
      <div className="flex justify-end items-center gap-2">
        <Button
          aria-label={`category plus`}
          className="w-8 h-8 hover:bg-primary-modal"
        >
          <Plus />
        </Button>
        <Button
          aria-label={`category minus`}
          className="px-1 h-8 hover:bg-primary-modal"
        >
          <Plus />
          <span className="font-medium">1</span>
          <Minus />
        </Button>
      </div>
      <h1 className="absolute left-0 top-3 textSmall2 px-2 py-1 bg-red-400 text-white font-medium rounded-r-md">
        15% Скидка
      </h1>
    </div>
  );
};
