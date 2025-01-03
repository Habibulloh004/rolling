"use client";
import { getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import CustomImage from "@/components/shared/customImage";
import Image from "next/legacy/image";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useTranslations } from "use-intl";
import { Button } from "@/components/ui/button";
import LoveSvg from "@/public/assets/love";
import { useState } from "react";

const Categories = ({ categories, locale }) => {
  const allT = useTranslations("All");
  return (
    <Container className={`mt-5 w-full flex-col gap-3 pb-4`}>
      <div className="w-11/12 flex justify-between items-center gap-3">
        <h1 className="font-bold text-thin text-xl">{allT("categories")}</h1>
        <Link
          locale={locale}
          href={"/hey"}
          className="flex justify-end items-center gap-1 text-primary text-sm font-medium"
        >
          {allT("more")}
          <ChevronRight size={18} />
        </Link>
      </div>
      <Carousel
        className="relative w-full text-foreground mt-5 md:mt-10 "
        paginate={"false"}
      >
        {/* <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" /> */}
        <CarouselContent className="relative">
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            return (
              <CarouselItem
                key={i}
                className={`basis-[45%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${i == 0 && "max-sm:ml-14 max-md:ml-16 ml-8"}`}
              >
                <Link
                  locale={locale}
                  href={"/hey"}
                  className="relative w-full h-full"
                >
                  <div className="relative rounded-[40px] w-full aspect-square overflow-hidden">
                    <CustomImage
                      src={`${posterUrl}${item.category_photo}`}
                      className="w-full h-full"
                      alt={`${localizedName}`}
                    />
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Categories;

const Card = ({ item, localizedName }) => {
  const [like, setLike] = useState(false);
  return (
    <div className="bg-white rounded-md p-2 space-y-2">
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
          {LoveSvg(like, 34, 36)}
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
        <Button className="px-1 h-8 hover:bg-primary-modal">
          <Plus />
          <span className="font-medium">1</span>
          <Minus />
        </Button>
      </div>
    </div>
  );
};
