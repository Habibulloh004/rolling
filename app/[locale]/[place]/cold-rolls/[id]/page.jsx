import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LoveSvg from "@/public/assets/love";
import { Heart, Minus, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

export default async function ColdRoll({ params }) {
  console.log(params);
  const [locale, all] = await Promise.all([
    getLocale(),
    getTranslations("All"),
  ]);
  return (
    <Container>
      <main className="w-full relative p-5 max-w-[700px] md:grid md:grid-cols-2 flex flex-col gap-5 mt-5">
        <button className="absolute right-1 top-1 md:right-2 md:top-2 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100">
          <Heart
            className={cn(
              "h-6 w-6",
              true ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
            )}
          />
        </button>
        <section className="w-full flex flex-col gap-3">
          <div className="w-full h-52 relative rounded-md overflow-hidden bg-secondary">
            <CustomImage
              src="/assets/images.png"
              alt="text"
              className={"w-full h-full object-cover"}
            />
          </div>
          <h1 className="textSmall1">
            <span className="">Входит в заказ :</span> Васаби Соевый соус
          </h1>
        </section>
        <section>
          <h1 className="textNormal">Филадельфия Classic</h1>
          <p className="textSmall">
            Нежный сливочный сыр, свежий огурец и благородный лосось. Воплощение
            всей тонкости и изящества вкуса в наилучшем своём исполнении в самом
            классическом ролле.
          </p>
          <h2 className="text-primary font-bold textNormal5">100 000 сум</h2>
        </section>
        <section className="flex justify-end items-center gap-5 col-span-2">
          <Button
            variant="ghost"
            className="border border-input bg-black/5 hover:bg-black/10 space-x-2"
          >
            <Plus />
            <span className="font-medium">1</span>
            <Minus />
          </Button>
          <Button className="w-40 hover:bg-primary-modal">{all("add")}</Button>
        </section>
      </main>
    </Container>
  );
}
