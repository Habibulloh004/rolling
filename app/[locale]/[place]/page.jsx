import dynamic from "next/dynamic";
import { getData } from "@/service";
import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import { ApiService } from "@/service/api.services";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Cards from "./reviews/_components/cards";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  toPublicCategory,
  toPublicProduct,
  toSearchCategory,
  toSearchProduct,
} from "@/lib/public-menu-data";
import { shouldIncludeProduct } from "@/lib/product-visibility";
import { reviewsData } from "@/data/reviews";
const TitleComponent = dynamic(() => import("./_components/titleComponent"), {
  ssr: true,
});
const Banner = dynamic(() => import("@/components/shared/banner"), {
  ssr: true,
});
const Categories = dynamic(() => import("./_components/categories"), {
  ssr: true,
});
const Popular = dynamic(() => import("./_components/popular"), {
  ssr: true,
});

export const metadata = {
  title:
    "Rolling Sushi – Доставка суши и роллов в Ташкенте | Бесплатная доставка | Бонусы до 10%",
  description:
    "🚀 Rolling Sushi – это не просто доставка, а вкус, который запоминается! 🍣 Платная доставка, но если опоздаем — она бесплатная! Гарантированная доставка за 45 минут, всегда свежие роллы. 🎁 Бонусная система с кешбэком до 10% – копите и оплачивайте любимые блюда! Закажите прямо сейчас – rolling.uz! (https://rolling.uz/)",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/uz/web",
    ru: "https://rollingsushi.uz/ru/web",
    en: "https://rollingsushi.uz/en/web",
  },
};

export const revalidate = 7200;

export async function generateStaticParams() {
  return ["uz", "ru", "en"].flatMap((locale) =>
    ["web", "branch"].map((place) => ({ locale, place }))
  );
}

export default async function HomePage({ params }) {
  // await sleep(10000);
  const path = await params;
  const [
    allT,
    bannersData,
    // reviewsData,
    categoriesData,
    productsData,
    locale,
  ] = await Promise.all([
    getTranslations("All"),
    getData(`/api/banners?lang=${path.locale}&platform=web&resolve=true`),
    // getData("/poster/google", 86400),
    ApiService.getPosterData("menu.getCategories", ""),
    ApiService.getPosterData("menu.getProducts", ""),
    getLocale(),
  ]);

  const banners = (bannersData?.banners || []).map((banner) => {
    if (!banner.imageUrl) {
      const webImage = banner.platforms?.web?.imageUrls?.[path.locale];
      const mobileImage = banner.platforms?.mobile?.imageUrls?.[path.locale];
      const deeplink = banner.platforms?.web?.deeplinks?.[path.locale] || banner.platforms?.mobile?.deeplinks?.[path.locale];
      return {
        ...banner,
        imageUrl: webImage || mobileImage || null,
        path: banner.path || deeplink || null,
      };
    }
    return banner;
  }).filter((banner) => banner.imageUrl);
  const categories = (categoriesData.response || [])
    .filter(
      (item) =>
        item.category_photo != null &&
        item.category_hidden != "1" &&
        item?.category_id != 0
    )
    .map(toPublicCategory)
    .filter(Boolean);
  const products = (productsData.response || [])
    .filter((item) =>
      shouldIncludeProduct(item, {
        requirePhoto: true,
        requirePopularIngredient: true,
      })
    )
    .map(toPublicProduct)
    .slice(0, 12)
    .filter(Boolean);

  return (
    <Container className={"w-full flex-col pb-10"}>
      {path.place == "branch" && (
        <TitleComponent
          locale={locale}
          path={path}
          initialSearchCatalog={{
            categories: (categoriesData.response || [])
              .map(toSearchCategory)
              .filter(
                (category) =>
                  category &&
                  Number(category.category_hidden) === 0 &&
                  Number(category.category_id) !== 0
              ),
            products: (productsData.response || [])
              .map(toSearchProduct)
              .filter(
                (product) =>
                  product &&
                  Number(product.hidden) === 0 &&
                  Number(product.menu_category_id) !== 0
              ),
          }}
        />
      )}
      {path.place != "branch" && <Banner banners={banners} />}
      <Categories categories={categories} locale={locale} path={path} />
      <Popular products={products} locale={locale} path={path} />
      {reviewsData?.length > 0 && (
        <div className="w-full flex flex-col items-start md:px-12 pt-6 gap-5">
          <div className="max-md:w-11/12 mx-auto flex items-center justify-between w-full">
            <Link
              className="text-xl md:text-2xl text-muted font-semibold"
              href={`/${path.locale}/${path.place}/reviews`}
            >
              {allT("reviews")}
            </Link>
            <Link
              className="flex justify-end items-center gap-1 text-primary textSmall3 font-medium"
              href={`/${path.locale}/${path.place}/reviews`}
            >
              {allT("more")}
              <ChevronRight size={18} />
            </Link>
          </div>
          <Carousel
            className="relative w-full text-foreground mt-5 "
            paginate={"false"}
            opts={{
              align: "center",
            }}
          >
            <CarouselContent className="relative">
              {reviewsData
                .filter((item) => item.rating >= 4)
                .map((item, i) => {
                  return (
                    <CarouselItem
                      key={i}
                      className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${
                        i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                      }`}
                    >
                      <a href="https://g.co/kgs/YJy7TYy" target="_blank">
                        <Cards data={item} />
                      </a>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </Container>
  );
}
