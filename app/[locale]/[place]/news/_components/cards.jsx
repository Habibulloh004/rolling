"use client";
import React from "react";
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
import Link from "next/link";

// Function to convert HTML to React components with Tailwind classes
const htmlToReact = (htmlString) => {
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;

  const processNode = (node) => {
    if (node.nodeType === 3) {
      // Text node
      return node.textContent;
    }
    if (node.nodeType === 1) {
      // Element node
      const props = {};
      const children = Array.from(node.childNodes).map((child, index) =>
        processNode(child)
      );

      switch (node.tagName.toLowerCase()) {
        case "h1":
          return (
            <h1
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="text-3xl font-bold mb-4"
            >
              {children}
            </h1>
          );
        case "h2":
          return (
            <h2
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="text-2xl font-bold mb-3"
            >
              {children}
            </h2>
          );
        case "h3":
          return (
            <h3
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="text-xl font-bold mb-2"
            >
              {children}
            </h3>
          );
        case "p":
          return (
            <p
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="mb-2"
            >
              {children}
            </p>
          );
        case "strong":
          return (
            <strong
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="font-bold"
            >
              {children}
            </strong>
          );
        case "em":
          return (
            <em
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="italic"
            >
              {children}
            </em>
          );
        case "ol":
          return (
            <ol
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="list-decimal list-inside mb-2"
            >
              {children}
            </ol>
          );
        case "li":
          return (
            <li
              key={node.tagName + "-" + Math.random().toString(36).substr(2, 9)}
              className="ml-4"
            >
              {children}
            </li>
          );
        default:
          return children;
      }
    }
    return null;
  };

  return Array.from(temp.childNodes).map((node, index) => processNode(node));
};


const PromotionCards = ({ param, item }) => {
  const allT = useTranslations("All");

  const fullContent = htmlToReact(item.description);

  return (
    <main>
      <Card>
        <CardHeader className="p-0">
          <div className="relative aspect-[15/5]">
            <CustomImage
              src={
                item?.id ? `${url}/banner/get_banner/${item.id}` : "/empty.jpg"
              }
              alt="news-img"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <CardDescription className="text-primary textNormal">
              {allT(`${item.subtitle}`)}
            </CardDescription>
            <CardTitle className="textSmall4 tracking-wider pt-3">
              {item.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger>
              <p className="text-sm lg:text-base text-[#5353e7]">
                {allT("more")}
              </p>
            </DialogTrigger>
            <DialogContent mark="false" className="px-5">
              <DialogHeader>
                <DialogTitle as="div" />
                <div className="text-xs w-[90vw] md:w-[70vw] md:text-base font-normal text-start">
                  <div>{fullContent}</div>
                  <br />
                  <Link
                    href={`/${param.locale}/${param.place}${item.path}`}
                    className="text-blue-500 underline mt-2 inline-block"
                  >
                    {allT("goto")}
                  </Link>
                </div>
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
