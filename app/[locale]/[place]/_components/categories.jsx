"use client";
import { formatText, getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CustomImage from "@/components/shared/customImage";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "use-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const Categories = ({ categories, locale, path }) => {
  const allT = useTranslations("All");
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");

  return (
    <Container className={`mt-3 md:mt-5 w-full flex-col gap-3 pb-4`}>
      <div className="w-11/12 flex justify-between items-center gap-3">
        <Link
          locale={locale}
          href={`/${locale}/${path?.place}/category`}
          className="font-bold text-thin textNormal4"
        >
          {allT("categories")}
        </Link>
        {path.place !== "branch" && (
          <Link
            locale={locale}
            href={`/${locale}/${path?.place}/category`}
            className="flex justify-end items-center gap-1 text-primary textSmall3 font-medium"
          >
            {allT("more")}
            <ChevronRight size={18} />
          </Link>
        )}
      </div>
      {path.place == "branch" ? (
        <div className="w-11/12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-7 gap-5">
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            const linkName = formatText(
              getLocalizedCategoryName(item.category_name, "en")
            );
            return (
              <div key={i} className={``}>
                <Link
                  href={
                    path?.place !== "branch"
                      ? `/${locale}/${path?.place}/category/${item?.category_id}-${linkName}`
                      : `/${locale}/${path?.place}/category/${item?.category_id}-${linkName}?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
                  }
                  className="space-y-2 relative w-full h-full"
                >
                  <div className="w-full max-sm:max-h-32 aspect-square relative rounded-[20px] md:rounded-[40px] overflow-hidden">
                    <CustomImage
                      src={
                        item?.category_photo_origin
                          ? `${posterUrl}${item?.category_photo_origin}`
                          : "/empty.jpg"
                      }
                      className="w-full h-full object-cover aspect-square"
                      alt={`${localizedName}`}
                    />
                  </div>
                  <h1 className="text-center textSmall3 font-bold">
                    {localizedName}
                  </h1>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
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
              const linkName = formatText(
                getLocalizedCategoryName(item.category_name, "en")
              );
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[25%] sm:basis-[20%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${
                    i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                  }`}
                >
                  <Link
                    href={`/${locale}/${path?.place}/category/${item?.category_id}-${linkName}`}
                    className="space-y-2 relative w-full h-full"
                  >
                    <div className="relative rounded-[20px] sm:rounded-[40px] w-full aspect-square overflow-hidden">
                      <CustomImage
                        src={
                          item?.category_photo_origin
                            ? `${posterUrl}${item.category_photo_origin}`
                            : "/empty.jpg"
                        }
                        className="w-full h-full"
                        alt={`${localizedName}`}
                        photo={item.category_photo}
                      />
                    </div>
                    <h1 className="text-center textSmall3 font-bold">
                      {localizedName}
                    </h1>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      )}
    </Container>
  );
};

export default Categories;
