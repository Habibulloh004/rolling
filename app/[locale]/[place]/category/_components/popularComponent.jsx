import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { formatText } from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { toCategoryBrowserProduct } from "@/lib/public-menu-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Card from "@/components/shared/card";
import { cacheDurations } from "@/lib/cache-config";
import { shouldIncludeProduct } from "@/lib/product-visibility";

export default async function PopularComponent({ path }) {
  const all = await getTranslations("All");
  const { response: rawProducts = [] } = await ApiService.getPosterData(
    "menu.getProducts",
    "",
    cacheDurations.products
  );

  const products = rawProducts
    .filter((item) =>
      shouldIncludeProduct(item, {
        requirePhoto: true,
        requirePopularIngredient: true,
      })
    )
    .map((product) => toCategoryBrowserProduct(product, path.locale))
    .filter(Boolean)
    .slice(0, 12);

  if (!products.length) {
    return null;
  }

  return (
    <section className="w-11/12 mt-5 space-y-3 pb-4">
      <div className="w-11/12 sm:w-full mx-auto flex justify-between items-center gap-3">
        <h1 className="font-bold text-primary textNormal4 w-full">
          {all("popular")}
        </h1>
        <Link
          href={`/${path.locale}/${path?.place}/new-popular`}
          variant="ghost"
          className="p-0 flex justify-end items-center gap-1 text-primary hover:text-primary text-sm font-medium"
        >
          {all("more")}
          <ChevronRight size={18} />
        </Link>
      </div>
      <Carousel className="relative w-full text-foreground mt-5 md:mt-10 ">
        <CarouselContent className="relative">
          {products.map((item, i) => {
            const linkNameProduct = formatText(item.linkNameProduct);
            const linkNameCategory = formatText(item.linkNameCategory);

            return (
              <CarouselItem
                key={item.product_id || i}
                className={`basis-[40%] sm:basis-[30%] md:basis-[20%] lg:basis-[15%] p-0 mx-2 ${
                  i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                }`}
              >
                <Card
                  locale={path.locale}
                  item={item}
                  defaultHref={`/${path.locale}/${path.place}/category/${item?.menu_category_id}-${linkNameCategory}/product/${item?.product_id}-${linkNameProduct}`}
                  localizedName={item.localizedName}
                  localizedDesc={item.localizedDesc}
                  photo={item.photo_origin || item.photo}
                  price={item?.price["1"] / 100}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
