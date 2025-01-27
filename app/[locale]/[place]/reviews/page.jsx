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

const Reviews = async ({ params }) => {
  const [allT, param, reviewData] = await Promise.all([getTranslations("All"), params, getData("/poster/google"),
  ]);
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
          {reviewData.result.reviews?.map((item, i) => (
            <CarouselItem
              key={i}
              className={`basis-[80%] sm:basis-[45%] lg:basis-[45%] xl:basis-[30%] p-0 mx-2 ${i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
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
