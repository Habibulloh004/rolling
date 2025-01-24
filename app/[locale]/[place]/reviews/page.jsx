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

const Reviews = async ({ params }) => {
  const [allT, param] = await Promise.all([getTranslations("All"), params]);
  const fakeData = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      review:
        "Amazing service! The staff was very friendly, and the food was delicious. Highly recommended.",
      date: "2025-01-01",
    },
    {
      id: 2,
      name: "Anna Ivanova",
      rating: 4,
      review:
        "Great experience overall. The ambiance was cozy, but the food took a bit long to arrive.Great experience overall. The ambiance was cozy, but the food took a bit long to arrive.Great experience overall. The ambiance was cozy, but the food took a bit long to arrive.Great experience overall. The ambiance was cozy, but the food took a bit long to arrive.",
      date: "2025-01-02",
    },
    {
      id: 3,
      name: "Ali Vohidov",
      rating: 3,
      review:
        "It was okay. The food was average, and the service could be improved. Not bad, but not great either.",
      date: "2025-01-03",
    },
    {
      id: 4,
      name: "Emily Johnson",
      rating: 5,
      review:
        "Absolutely fantastic! The presentation of the dishes was impressive, and everything tasted perfect.",
      date: "2025-01-04",
    },
    {
      id: 5,
      name: "Carlos Martinez",
      rating: 2,
      review:
        "Unfortunately, my experience wasn’t great. The service was slow, and the food was not up to expectations.",
      date: "2025-01-05",
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
          {fakeData.map((item, i) => (
            <CarouselItem
              key={i}
              className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${
                i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
              }`}
            >
              <Cards data={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Reviews;
