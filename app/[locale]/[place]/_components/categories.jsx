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
import { ChevronRight } from "lucide-react";
import { useTranslations } from "use-intl";

const Categories = ({ categories, locale }) => {
  const allT = useTranslations("All");
  return (
    <Container className={`mt-5 w-full flex-col gap-3 pb-4`}>
      <div className="w-11/12 flex justify-between items-center gap-3">
        <h1 className="font-bold text-thin text-xl">{allT("categories")}</h1>
        <Link
          locale={locale}
          href={"/web/categories"}
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

