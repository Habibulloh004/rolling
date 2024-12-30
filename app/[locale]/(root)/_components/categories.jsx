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
import { ChevronRight } from "lucide-react";

const Categories = ({ categories, locale }) => {
  return (
    <Container className={`mt-5 w-full flex-col gap-3 pb-4`}>
      <div className="w-full flex justify-between items-center gap-3">
        <h1 className="font-bold text-thin text-xl">Категории</h1>
        <Link
          locale={locale}
          href={"/hey"}
          className="flex justify-end items-center gap-1 text-primary text-sm font-medium"
        >
          Увидеть больше
          <ChevronRight size={18} />
        </Link>
      </div>
      <Carousel
        className="relative w-full text-foreground mt-12 "
        paginate={"false"}
      >
        <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" />
        <CarouselContent className="relative">
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            return (
              <CarouselItem
                key={i}
                className={`basis-[15%] p-0 mx-2 bg-white rounded-xl ${
                  i == 0 && "ml-4"
                }`}
              >
                <Link locale={locale} href={"/hey"} className="relative">
                  <div className="relative w-full h-40 overflow-hidden rounded-md">
                    <CustomImage
                      src={`${posterUrl}${item.category_photo}`}
                      className="object-cover"
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
