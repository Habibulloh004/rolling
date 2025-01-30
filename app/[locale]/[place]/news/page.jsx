import { getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import { getData } from "@/service";
import PromotionCards from "./_components/cards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const metadata = {
  title: "Новости Rolling Sushi – Акции, скидки и новинки в Ташкенте",
  description:
    "Будьте в курсе всех новинок, акций и скидок Rolling Sushi! Следите за свежими новостями и получайте лучшие предложения.",
  keywords:
    "акции суши, скидки на роллы, новости японской кухни, Rolling Sushi, новинки меню",
  alternates: {
    canonical: "https://rolling.uz/uz/web/news",
    ru: "https://rolling.uz/ru/web/news",
    en: "https://rolling.uz/en/web/news",
  },
};

const News = async ({ params }) => {
  const [param, bannersData, newsT] = await Promise.all([
    params,
    getData("/banner/get_banners", 86400),
    getTranslations("NewsPage"),
  ]);

  const banners = bannersData.banners;
  return (
    <Container className={`w-full flex-col items-start pb-4 mt-5`}>
      <h1 className="w-11/12 mx-auto text-muted text-xl md:text-2xl font-semibold">
        {newsT("title")}
      </h1>
      <Carousel
        opts={{
          align: "center",
        }}
        className="relative w-full text-foreground mt-5 md:mt-10 "
        paginate={"false"}
      >
        {/* <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" /> */}
        <CarouselContent className="relative">
          {banners.map((item, i) => {
            if (item.lang != param.locale) {
              return;
            }
            return (
              <CarouselItem
                key={i}
                className={`basis-[100%] lg:basis-[45%] p-0 px-4 ${
                  i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                }`}
              >
                <PromotionCards param={param} item={item} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default News;
