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
    "🚀 Rolling Sushi – это не просто доставка, а вкус, который запоминается! 🍣 Бесплатная доставка по акции, доставка за 40 минут или ролл в подарок, всегда свежие роллы. 🎁 Бонусная система с кешбэком до 10% – копите и оплачивайте любимые блюда! Закажите прямо сейчас – rolling.uz!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/uz/web",
    ru: "https://rollingsushi.uz/ru/web",
    en: "https://rollingsushi.uz/en/web",
  },
};
export default async function HomePage({ params, searchParams }) {
  // await sleep(10000);
  const [
    allT,
    bannersData,
    // reviewsData,
    categoriesData,
    productsData,
    searchParamsData,
    locale,
    path,
  ] = await Promise.all([
    getTranslations("All"),
    getData("/banner/get_banners", 86400),
    // getData("/poster/google", 86400),
    ApiService.getPosterData("menu.getCategories", "", 86400),
    ApiService.getPosterData("menu.getProducts", "", 7200),
    searchParams,
    getLocale(),
    params,
  ]);

  const reviewsData = [
    {
      id: 1,
      author_name: "B B",
      rating: 5,
      profile_photo_url: "https://avatars.mds.yandex.net/get-yapic/43978/0g-3/orig",
      text: `Пробовали очень вкусно`,
      time: "30.11.2024",
    },
    {
      id: 2,
      author_name: "Мадина Бабаниязова",
      rating: 5,
      profile_photo_url: "https://avatars.mds.yandex.net/get-yapic/69015/0a-9/orig",
      text: `Роллы вкусные но техника приготовления не очень понравилось роллы разваливаются !`,
      time: "28.02.2025",
    },
    {
      id: 3,
      author_name: "Akrom Yuldashev",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Уютно и вкусно`,
      time: "30.11.2024",
    },
    {
      id: 4,
      author_name: "Roxila Kamolova",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Очень вкусные и разные роллы 👍`,
      time: "30.11.2024",
    },
    {
      id: 5,
      author_name: "Отабек С.",
      rating: 5,
      profile_photo_url: "https://avatars.mds.yandex.net/get-yapic/59871/0y-2/orig",
      text: `Атмосферный ГАП йук, суши и роллов просто нет, свежий хаммаси и кузов на заказ, прозрачный ГАП йук но N_1 🔥 🔥 🔥`,
      time: "30.11.2024",
    },
    {
      id: 6,
      author_name: "Firdavs Dadakhonov",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Суперзвезда`,
      time: "30.11.2024",
    },
    {
      id: 7,
      author_name: "Makhammad Ali",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Отличное место покушать ролы,супы и салаты. Хороший сервис и очень вкусно.`,
      time: "07.11.2024",
    },
    {
      id: 8,
      author_name: "Мухаммад Бойматов",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Роллинг суши бомба честно говоря`,
      time: "30.11.2024",
    },
    {
      id: 9,
      author_name: "Мухаммадтурсун Назиров",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Очень вкусно`,
      time: "12.03.2025",
    },
    {
      id: 10,
      author_name: "Soliha Maxsudaliyeva",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Классные 🍣. Быстрый сервис`,
      time: "25.07.2024",
    },
    {
      id: 11,
      author_name: "Bekhruz Ibragimov",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Хорошие и качественные суши, моя семья довольна`,
      time: "27.08.2024",
    },
    {
      id: 12,
      author_name: "Потомок повелителей",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Вкусно`,
      time: "03.01.2025",
    },
    {
      id: 13,
      author_name: "Feruz Zayniyev",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Классно`,
      time: "21.08.2024",
    },
    {
      id: 14,
      author_name: "Аза Юнусов",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `вкусно`,
      time: "23.08.2024",
    },
    {
      id: 15,
      author_name: "Tamila Dj",
      rating: 5,
      profile_photo_url: "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Это было оооочень” вкусно`,
      time: "19.01.2025",
    },
  ];
  let spotData;
  if (path.place === "branch") {
    spotData = await ApiService.getPosterData(
      "spots.getSpot",
      `&spot_id=${searchParamsData.spot}`,
      604800
    );
  }

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) =>
      item.category_photo != null &&
      item.category_hidden != "1" &&
      item?.category_id != 0
  );
  const products = productsData.response.filter((item) => {
    const findIngr = item?.ingredients?.find(
      (ingr) => ingr?.ingredient_id == 211
    );
    if (
      item.photo_origin != null &&
      item?.menu_category_id != 0 &&
      findIngr &&
      item?.hidden == 0
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <Container className={"w-full flex-col pb-10"}>
      {path.place == "branch" && (
        <TitleComponent
          searchParamsData={searchParamsData}
          products={productsData?.response}
          categories={categories}
          locale={locale}
          path={path}
          spotData={spotData}
        />
      )}
      {path.place != "branch" && <Banner path={path} banners={banners} />}
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
              {reviewsData?.map((item, i) => {
                if (item.rating < 4) return;
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
