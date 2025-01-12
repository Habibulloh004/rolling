"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "react-simple-star-rating";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Cards = ({ data }) => {
  const { name, rating, review, date } = data;
  return (
    <Card
      key={review.id}
      className="border-0 border-t-2 rounded-none shadow-none border-t-[#43674E] flex"
    >
      <CardContent className="pt-6">
        <div className="h-full flex flex-col justify-between items-start gap-4">
          {/* <Avatar className="bg-[#D9D9D9]">
            <AvatarFallback>{review.client}</AvatarFallback>
          </Avatar> */}
          <div className="flex-1 flex flex-col items-start justify-between">
            <article>
              <div className="flex items-center gap-2">
                <span className="font-medium w-3/5">Клиент: {name}</span>
                <Rating
                  initialValue={rating}
                  allowHover={false}
                  allowFraction
                  size={25}
                  fillColorArray={[
                    "#f17a45",
                    "#f19745",
                    "#f1a545",
                    "#f1b345",
                    "#f1d045",
                  ]}
                  transition
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{review}</p>
            </article>
            <time suppressHydrationWarning className="mt-2 block text-sm text-gray-500">{date}</time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
