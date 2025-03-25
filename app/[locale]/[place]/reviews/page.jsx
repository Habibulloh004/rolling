import Container from "@/components/shared/container";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import React, { Fragment } from "react";
import Cards from "./_components/cards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getData } from "@/service";

export const metadata = {
  title: "Отзывы о Rolling Sushi – Мнение клиентов",
  description:
    "Реальные отзывы наших клиентов! ⭐️ Узнайте, что говорят о вкусе, качестве и скорости доставки Rolling Sushi. Делитесь своим мнением и помогайте нам становиться лучше.",
};

const Reviews = async ({ params }) => {
  const [allT, param] = await Promise.all([
    getTranslations("All"),
    params,
    // getData("/poster/google", 86400),
  ]);

  const reviewData = [
    {
      id: 1,
      author_name: "B B",
      rating: 5,
      profile_photo_url:
        "https://avatars.mds.yandex.net/get-yapic/43978/0g-3/orig",
      text: `Пробовали очень вкусно`,
      time: "30.11.2024",
    },
    {
      id: 2,
      author_name: "Мадина Бабаниязова",
      rating: 5,
      profile_photo_url:
        "https://avatars.mds.yandex.net/get-yapic/69015/0a-9/orig",
      text: `Роллы вкусные но техника приготовления не очень понравилось роллы разваливаются !`,
      time: "28.02.2025",
    },
    {
      id: 3,
      author_name: "Akrom Yuldashev",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Уютно и вкусно`,
      time: "30.11.2024",
    },
    {
      id: 4,
      author_name: "Roxila Kamolova",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Очень вкусные и разные роллы 👍`,
      time: "30.11.2024",
    },
    {
      id: 5,
      author_name: "Отабек С.",
      rating: 5,
      profile_photo_url:
        "https://avatars.mds.yandex.net/get-yapic/59871/0y-2/orig",
      text: `Атмосферный ГАП йук, суши и роллов просто нет, свежий хаммаси и кузов на заказ, прозрачный ГАП йук но N_1 🔥 🔥 🔥`,
      time: "30.11.2024",
    },
    {
      id: 6,
      author_name: "Firdavs Dadakhonov",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Суперзвезда`,
      time: "30.11.2024",
    },
    {
      id: 7,
      author_name: "Makhammad Ali",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Отличное место покушать ролы,супы и салаты. Хороший сервис и очень вкусно.`,
      time: "07.11.2024",
    },
    {
      id: 8,
      author_name: "Мухаммад Бойматов",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Роллинг суши бомба честно говоря`,
      time: "30.11.2024",
    },
    {
      id: 9,
      author_name: "Мухаммадтурсун Назиров",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Очень вкусно`,
      time: "12.03.2025",
    },
    {
      id: 10,
      author_name: "Soliha Maxsudaliyeva",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Классные 🍣. Быстрый сервис`,
      time: "25.07.2024",
    },
    {
      id: 11,
      author_name: "Bekhruz Ibragimov",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Хорошие и качественные суши, моя семья довольна`,
      time: "27.08.2024",
    },
    {
      id: 12,
      author_name: "Потомок повелителей",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Вкусно`,
      time: "03.01.2025",
    },
    {
      id: 13,
      author_name: "Feruz Zayniyev",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Классно`,
      time: "21.08.2024",
    },
    {
      id: 14,
      author_name: "Аза Юнусов",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `вкусно`,
      time: "23.08.2024",
    },
    {
      id: 15,
      author_name: "Tamila Dj",
      rating: 5,
      profile_photo_url:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      text: `Это было оооочень” вкусно`,
      time: "19.01.2025",
    },
  ];

  return (
    <Container
      className={`max-md:w-full w-11/12 flex-col items-start py-10 min-h-[400px] justify-center`}
    >
      <div className="max-md:w-11/12 mx-auto flex items-center justify-between w-full">
        <h1 className="text-xl md:text-2xl text-muted font-semibold">
          {allT("reviews")}
        </h1>
        <Link
          className="rounded-md bg-primary text-sm md:text-base text-white py-2 px-4 md:w-52 text-center"
          href={`/${param.locale}/${param.place}/create-review`}
        >
          {allT("sendReview")}
        </Link>
      </div>
      <Carousel
        className="relative w-full text-foreground mt-5 md:mt-10 "
        paginate={"false"}
        opts={{
          align: "center",
        }}
      >
        <CarouselContent className="relative">
          {reviewData?.map((item, i) => {
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
    </Container>
  );
};

export default Reviews;
