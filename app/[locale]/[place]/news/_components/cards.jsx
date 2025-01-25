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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomImage from "@/components/shared/customImage";
import { url } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DialogTitle } from "@radix-ui/react-dialog";

const PromotionCards = ({ item }) => {
  const allT = useTranslations("All")
  const [isExpanded, setIsExpanded] = useState(false);
  const text = item.description.replace(/\\\\n/g, '\n\n') // Ikki qator sakrash
    .replace(/\\n/g, '\n');
  const firstLine = text.split("\n")[0];
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
            <CardTitle className="textSmall4 tracking-wider pt-3">
              {item.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line w-full">{firstLine}</p>
          <Dialog>
            <DialogTrigger >
              <p className="text-sm lg:text-base text-[#5353e7]">{allT("more")}</p>
            </DialogTrigger>
            <DialogContent mark="false" className={"px-5"}> 
                <DialogHeader>
                <DialogTitle as="div">
                        </DialogTitle>
                  <DialogDescription className="text-xs md:text-base font-normal text-start whitespace-pre-line">
                    {text}
                  </DialogDescription>
                </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="text-xs flex items-center justify-between">
          <p>{item.createdAt}</p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default PromotionCards;
