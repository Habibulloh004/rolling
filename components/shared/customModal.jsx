"use client";

import * as React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import CustomFormField from "./customFormField";
import RegisterForm from "../pages/RegisterForm";
import { useLocale, useTranslations } from "next-intl";

export function ProductDialog({ product }) {
  const [isFavorite, setIsFavorite] = React.useState(product.isFavorite);

  return (
    <div className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <Image
          src={product.image || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          width={200}
          height={200}
          className="rounded-lg"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-100"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
            )}
          />
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-[#6B6B6B]">{product.price}</p>
      </div>
      <div className="relative mt-4 aspect-square overflow-hidden rounded-lg">
        <Image
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <p className="mt-2 text-[#6B6B6B]">{product.description}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold">{product.price}</span>
        <Button className="bg-[#43674E] hover:bg-[#43674E]/90">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
export function LoginModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login modal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-10" mark="false">
        <DialogHeader>
          <DialogTitle>Ddd</DialogTitle>
          <DialogDescription className="text-[#6B6B6B]">ddd</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export function RegisterModal() {
  const locale = useLocale();
  const register = useTranslations("Register");
  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button>Register modal</Button>
      </DialogTrigger>
      <DialogContent
        className="no-scrollbar bg-primary max-h-screen overflow-y-scroll max-w-3xl w-6/10 px-10 py-5 focus:outline-none border-0 rounded-sm sm:rounded-md"
        mark="none"
      >
        <DialogHeader>
          <DialogTitle className="textSmall3 text-white">
            {register("title")}
          </DialogTitle>
          <DialogDescription className="text-white text-[12px] ml-3">
            {register("description")}
          </DialogDescription>
        </DialogHeader>
        <RegisterForm />
      </DialogContent>
    </Dialog>
  );
}
