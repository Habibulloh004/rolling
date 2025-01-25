"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import CustomImage from "@/components/shared/customImage";

const PromotionCards = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Matnning kesilgan qismini aniqlash
  const shortDescription =
    item.description.length < 70
      ? item.description
      : `${item.description.slice(0, 70)}...`;

  return (
    <main>
      <Card>
        <CardHeader className="p-0">
          <div className="relative h-40 md:h-60">
            <CustomImage
              src={`/assets/news.svg`}
              alt="news-img"
              className="w-full object-cover aspect-video"
            />
          </div>
          <div className="p-6">
            <CardDescription className="text-primary textNormal">
              {item.text}
            </CardDescription>
            <CardTitle className="textSmall4 tracking-wider">
              {item.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="textSmall3">
            {isExpanded ? item.description : shortDescription}
            {/* Agar matn kesilgan bo‘lsa, "3 nuqta"ni yoki tugmani qo‘shamiz */}
            {item.description.length > 70 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-500 ml-2 underline cursor-pointer"
              >
                {isExpanded ? "Yopish" : "Ko‘proq ko‘rish"}
              </button>
            )}
          </p>
        </CardContent>
        <CardFooter className="text-xs flex items-center justify-between">
          <p>{item.date}</p>
          <span className="flex items-center">
            <Eye className="size-4 inline mr-1 align-middle" />
            <p>{item.view}</p>
          </span>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PromotionCards;
