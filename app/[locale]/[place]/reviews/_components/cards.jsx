"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "react-simple-star-rating";
import { formatTimestampToDateWithDots, truncateText } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Cards = ({ data }) => {
  const {
    author_name: name,
    rating,
    profile_photo_url,
    text: review,
    time: date,
  } = data;
  return (
    <Card
      key={review.id}
      className="h-52 bg-white border-0 border-t-2 rounded-none shadow-none border-t-[#43674E] flex"
    >
      <CardContent className="pt-6 w-full">
        <div className="h-full flex flex-col justify-between items-start gap-4 w-full">
          <div className="flex-1 flex flex-col items-start justify-between w-full">
            <article className="w-full">
              <div className="flex items-start justify-between w-full gap-2">
                <span className="font-medium w-3/5">
                  <Avatar className="bg-[#D9D9D9] mb-2">
                    <AvatarImage src={profile_photo_url} alt="avatar image" />
                    {/* <AvatarFallback>{profile_photo_url}</AvatarFallback> */}
                  </Avatar>{" "}
                  {name}
                </span>
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
              <p className="mt-2 text-sm text-gray-600">
                {truncateText(review, 100)}
              </p>
            </article>
            <time
              suppressHydrationWarning
              className="mt-2 block text-sm text-gray-500"
            >
              {/* {formatTimestampToDateWithDots(date)} */}
              {date}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cards;
