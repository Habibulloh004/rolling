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
    {
      id: 16,
      author_name: "Дамир Муратов",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocJVySIbpSKCIvB3_VHmtxoovynveCzMWtjfTF9rPCey8bWywA=w75-h75-p-rp-mo-br100",
      text: `Каждый раз заказываю только у вас, очень вкусные роллы,и доставка очень быстро и цены не дорогие рекомендую 👍`,
      time: "10.01.2025",
    },
    {
      id: 17,
      author_name: "Shavkat Abdullaev",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocIBg0xXv6Zm83NCqzKv4WT5SWwsTD46HtxxYR3Hw1-14vl86w=w75-h75-p-rp-mo-br100",
      text: `Самые вкусные роллы в ташкенте, рекомендую💯`,
      time: "17.01.2025",
    },
    {
      id: 18,
      author_name: "Озодбек Мирзабаев",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocII5TVOcUOSG9gCQSpbNoEZes0YxLGfQQrhVNYRH6krO1rWIw=w75-h75-p-rp-mo-br100",
      text: `Вкусные роллы и сытные. 👍`,
      time: "19.01.2025",
    },
    {
      id: 19,
      author_name: "Юсуфбек Матниязов",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjX8yO1xGaY1GnHCKq-VhWzWRzf5V4r0ES8T93mGk3H9F9uPpmc=w75-h75-p-rp-mo-br100",
      text: `Rolling sushi best of the best 👍🔥✊`,
      time: "27.11.2024",
    },
    {
      id: 20,
      author_name: "shohjahon davronov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKu0DnJo33qxGiGkGUohq61z2bdG_UYKr_Ej0Wbrlh4incl7w=w75-h75-p-rp-mo-br100",
      text: `Лучший суши`,
      time: "03.07.2024",
    },
    {
      id: 21,
      author_name: "Shokhzeb Otakhanov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLCDif_i1LJLnHtgdvJuSFj8UfDkSSqLqmv3DwPkJS5E3LEvg=w75-h75-p-rp-mo-br100",
      text: `super`,
      time: "13.07.2024",
    },
    {
      id: 22,
      author_name: "Firdavs Dadakhonov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJaDBO6BdjANhNZHlsbOz4WyFO1CS51mtxHSkp_b5QsQZKbBk-=w75-h75-p-rp-mo-br100",
      text: `Мне больше нравились роли запичони`,
      time: "17.01.2025",
    },
    {
      id: 23,
      author_name: "Zuhriddin Timirov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKQW41lgssuOcqkg82ncXR8FU1IBIaS7bpgs_f08prcvkBf5zU=w75-h75-p-rp-mo-br100",
      text: `Это вкусно`,
      time: "19.07.2024",
    },
    {
      id: 24,
      author_name: "Dilnoza Dogman",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKRoz8y4Ukvd7WN2GjpVJWwDUt2jPLBKvegQqtbqmxXtjF5jg=w75-h75-p-rp-mo-br100",
      text: `Атмосфера очень уютно, суши вкусней чем другие суши, советую не пожалейте😋`,
      time: "14.01.2025",
    },
    {
      id: 25,
      author_name: "Ulug'bek Turdiyev",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKRoz8y4Ukvd7WN2GjpVJWwDUt2jPLBKvegQqtbqmxXtjF5jg=w75-h75-p-rp-mo-br100",
      text: `Gap yoo`,
      time: "07.08.2024",
    },
    {
      id: 26,
      author_name: "Юсуфбек Матниязов",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjX8yO1xGaY1GnHCKq-VhWzWRzf5V4r0ES8T93mGk3H9F9uPpmc=w75-h75-p-rp-mo-br100",
      text: `Все просто на вышем уровне`,
      time: "29.11.2024",
    },
    {
      id: 27,
      author_name: "Дониёрбек Утаров",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjW8erKTj3w1OGZfNaRlchA-Own7TGQgOcUY0SKYG6Ndn3YNQjPI=w75-h75-p-rp-mo-br100",
      text: `Nice place 🤩`,
      time: "07.07.2024",
    },
    {
      id: 27,
      author_name: "Google User",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocJzBwRR1FmlK-OJ-4vGVKrIYgcqmPVmvwwnGoLRoS2cvNKkug=w75-h75-p-rp-mo-ba3-br100",
      text: `Так как суши сложные на вкус, приготовили быстро, атмосфера расслабляющая, рекомендую`,
      time: "17.11.2024",
    },
    {
      id: 28,
      author_name: "Abu Shukurov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWvDHXjlDkyD31qeOCBTiDBRjtXLBlhs4HBgwcrNyfan7dIrxY=w75-h75-p-rp-mo-br100",
      text: `Недавно заказал суши в Rolling Sushi, и это был потрясающий опыт! Все блюда были очень свежими, аккуратно приготовленными и доставлены вовремя. Особенно понравился фирменный сет – его вкус и качество просто на высоте. Приятно, что у ресторана удобное мобильное приложение, где можно легко оформить заказ и отслеживать доставку.

      Также хочу отметить вежливость и профессионализм курьеров – всегда приветливые и пунктуальные. Спасибо Rolling Sushi за отличный сервис! Обязательно закажу у вас снова!`,
      time: "15.01.2025",
    },
    {
      id: 29,
      author_name: "Азизбек Арзибаев",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLx4bLsGfpQ_Rzu-4NqDOwU0jc1F7cQqTISN-A2FyXE-LYH9Q=w75-h75-p-rp-mo-br100",
      text: `Вот это настоящее суши!`,
      time: "10.12.2024",
    },
    {
      id: 30,
      author_name: "Alisher Akromov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjVwh9Q9sGyPmunGXRcIfifIMbZBQbHc5U1z5SqIk8vQGdNt7D95=w75-h75-p-rp-mo-br100",
      text: `Самые лучшие суши только в роллинг суши просто бомбически вкус. И отмосфера просто шикарное`,
      time: "03.01.2025",
    },
    {
      id: 31,
      author_name: "Primex Services",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLGILq5XA9xKaMcEkLOJdHbcXmAPlc-8mfzCMydOcFuB7IuYQ=w75-h75-p-rp-mo-br100",
      text: `Оочень вкусно🔥 лучше чем во многих знаменитых суши заведений в Ташкенте, а самое главное это недорого 😍`,
      time: "21.07.2024",
    },
    {
      id: 32,
      author_name: "Санжар Ёрбеков",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjW16b6fOlyqxNFlEn6qBLTfYh0lFdYGGUGptN1iwHeOulggC08=w75-h75-p-rp-mo-br100",
      text: `Замечательные суши просто восхитительные.`,
      time: "28.02.2025",
    },
    {
      id: 33,
      author_name: "Javlon Tolipov",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWzLPuetbJfZ0olKQ6QfTIZaxO4Pg3cFDx-GidZnpqcss2Rsmjh=w75-h75-p-rp-mo-br100",
      text: `Очень вкусно готовят`,
      time: "17.11.2024",
    },
    {
      id: 34,
      author_name: "R7express Accounting",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLke9xwIVz4AVeIs4ba77rBqHNbSG0uDGfAhQFWEonNAY7VzA=w75-h75-p-rp-mo-br100",
      text: `N1 sushi in Tashkent!👌👌👌`,
      time: "01.08.2024",
    },
    {
      id: 35,
      author_name: "Мухаммад Жалолиддинович",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocIX2PhJHYF8zCl8wyJ57ong-cMJLpZ_FCkHxJPmRNRAzzVa1w=w75-h75-p-rp-mo-br100",
      text: `👍👍👍👍`,
      time: "30.07.2024",
    },
    {
      id: 36,
      author_name: "Муборак Ёрбекова",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjV41078RnjFFI13v9VZWJpB-oV7g3vwkB2J96O8R5lDu4Ee7c8=w75-h75-p-rp-mo-br100",
      text: `Роль очень хорошая, заказ прибыл вовремя, вкус хороший.`,
      time: "23.02.2025",
    },
    {
      id: 37,
      author_name: "Habiba Usmonova",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKSYqDC9wQ2PCn5O1AoxtZmOfoU41al5GPQEJVgNvh7GOffxg=w75-h75-p-rp-mo-br100",
      text: `Сервис уже на подходе, не пропустите ♥️`,
      time: "20.12.2024",
    },
    {
      id: 38,
      author_name: "John",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWfCTlXKSjW6dKxvAm_9OXw8g4V4MP0OttBa8SDcZUJZWKNfRKm=w75-h75-p-rp-mo-br100",
      text: `Простые бомбические суши стоят того, чтобы сходить туда.`,
      time: "03.07.2024",
    },
    {
      id: 39,
      author_name: "Отабек Саттаров",
      rating: 5,
      profile_photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjVZZATAoaL4RCULIfeaIGRQi_GBzYmqI7M5hcv0gLZj4mstqlcI=w75-h75-p-rp-mo-br100",
      text: `👍👍👍 Не волнуйтесь `,
      time: "05.01.2024",
    },
    {
      id: 40,
      author_name: "",
      rating: 5,
      profile_photo_url: "",
      text: ``,
      time: "17.11.2024",
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
          {[...reviewData]
            .sort(() => Math.random() - 0.5) // Tasodifiy tartiblash
            .map((item, i) => {
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
