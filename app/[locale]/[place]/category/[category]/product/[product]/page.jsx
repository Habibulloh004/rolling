import Container from "@/components/shared/container";
import CustomImage from "@/components/shared/customImage";
import { Button } from "@/components/ui/button";
import {
  cn,
  formatText,
  getLocalizedCategoryName,
  getLocalizedProduct,
  posterUrl,
} from "@/lib/utils";
import { ApiService } from "@/service/api.services";
import { Heart, Minus, Plus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function ProductPage({ params }) {
  const [locale, product, path, all] = await Promise.all([
    getLocale(),
    ApiService.getPosterData(
      `menu.getProduct`,
      `&product_id=${params.product}`
    ),
    params,
    getTranslations("All"),
  ]);
  const productData = product.response;
  const localizedName = getLocalizedProduct(
    productData.product_production_description,
    locale,
    "name"
  );
  const localizedNameCategory = getLocalizedCategoryName(
    productData.category_name,
    locale
  );
  const localizedDesc = getLocalizedProduct(
    productData.product_production_description,
    locale,
    "desc"
  );

  console.log(productData?.product_production_description);

  return (
    <Container
      className={"w-11/12 flex-col justify-start items-start pt-4"}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/${path?.place}/category`}>
              <h1 className="font-bold textSmall3">{all("categories")}</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={""} size={48} />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${locale}/${path?.place}/category/${
                productData?.menu_category_id
              }-${formatText(
                getLocalizedCategoryName(productData.category_name, "en")
              )}`}
            >
              <h1 className="font-bold textSmall3">{localizedNameCategory}</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={""} size={48} />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h1 className="font-bold textSmall3">{localizedName}</h1>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="w-full relative py-5 md:grid md:grid-cols-2 flex flex-col gap-5">
        <button className="z-50 absolute right-1 top-1 md:right-2 md:top-2 rounded-full bg-white p-1 shadow-sm transition-colors hover:bg-gray-100">
          <Heart
            className={cn(
              "h-6 w-6",
              true ? "fill-[#43674E] text-[#43674E]" : "text-gray-400"
            )}
          />
        </button>
        <section className="w-full flex flex-col gap-3">
          <div className="w-full max-sm:aspect-[16/14] aspect-[16/8] lg:aspect-[15/7] relative rounded-md overflow-hidden bg-secondary">
            <CustomImage
              src={`${posterUrl}${productData.photo_origin}`}
              alt="text"
              className={"w-full h-full object-cover sm:object-contain"}
            />
          </div>
        </section>
        <section className="space-y-2">
          <h1 className="textNormal4 text-primary font-bold">
            {localizedName}
          </h1>
          <p
            className="textSmall"
            dangerouslySetInnerHTML={{
              __html: localizedDesc.replace(/\./g, ".<br />"),
            }}
          ></p>

          <h2 className="text-primary font-bold textNormal5">
            {productData.price["1"] / 100} сум
          </h2>
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
