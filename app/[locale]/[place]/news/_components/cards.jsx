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
  const text = item.description.replace(/\\\\n/g, '\n\n') // Ikki qator sakrash
  .replace(/\\n/g, '\n'); 

  console.log(item);
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
          <p  className="whitespace-pre-line w-full">{text}</p>
        </CardContent>
        <CardFooter className="text-xs flex items-center justify-between">
          <p>{item.createdAt}</p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PromotionCards;
