import Container from "@/components/shared/container";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import React, { Fragment } from "react";
import Cards from "./_components/cards";

const Reviews = async ({ params }) => {
  const [allT, param] = await Promise.all([
    getTranslations("All"),
    params,
  ]);
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
        "Great experience overall. The ambiance was cozy, but the food took a bit long to arrive.",
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
      className={`flex-col items-start py-10 min-h-[400px] justify-center`}
    >
      <div className="flex items-center justify-between w-full">
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
      <main className="grid sm:grid-cols-2 lg:grid-cols-3 mt-3 lg:mt-6 gap-5 2xl:grid-cols-4">
        {fakeData.map((item) => (
          <Fragment key={item.id}>
            <Cards data={item} />
          </Fragment>
        ))}
      </main>
    </Container>
  );
};

export default Reviews;
