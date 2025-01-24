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
import { news } from "@/public";
import { Eye } from "lucide-react";
import CustomImage from "@/components/shared/customImage";
import { url } from "@/lib/utils";

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
          <div className="relative aspect-[15/5]">
            <CustomImage
              src={`${url}/banner/get_banner/${item.id}`}
              alt="news-img"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="p-6">
            <CardDescription className="text-primary textNormal">
              {item.subtitle}
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
          <p>{item.createdAt}</p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PromotionCards;
