import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Card from "@/components/shared/card";

export default async function Page() {
  const { response: categories } = await ApiService.getPosterData(
    "menu.getCategories"
  );
  const [locale, all] = await Promise.all([
    getLocale(),
    getTranslations("All"),
  ]);

  console.log(categories);

  return (
    <Container className="w-11/12 flex flex-col pt-5 space-y-3">
      <section className="w-full space-y-3">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNorma2 w-full">
            {all("categories")}
          </h1>
          <Button
            variant="ghost"
            className="p-0 flex justify-end items-center gap-1 text-primary hover:text-primary text-sm font-medium"
          >
            {all("more")}
            <ChevronRight size={18} />
          </Button>
        </div>
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {categories?.map((item, i) => {
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
                <div className="w-full h-40 relative rounded-[40px] overflow-hidden">
                  <CustomImage
                    src={`${posterUrl}${item.category_photo}`}
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
        </div>
      </section>

      {/* Carousel for popular categories */}
      <section className="w-full mt-5 space-y-3 pb-4">
        <div className="flex justify-between items-center gap-3">
          <h1 className="font-bold text-primary textNorma2 w-full">
            {all("popular")}
          </h1>
          <Button
            variant="ghost"
            className="p-0 flex justify-end items-center gap-1 text-primary hover:text-primary text-sm font-medium"
          >
            {all("more")}
            <ChevronRight size={18} />
          </Button>
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
                  className={`basis-[45%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${
                    i == 0 && "max-sm:ml-14 max-md:ml-16 ml-8"
                  }`}
                >
                  <Card locale={locale} item={item} localizedName={localizedName} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </section>
    </Container>
  );
}
