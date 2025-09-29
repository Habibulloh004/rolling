"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Container from "@/components/shared/container";
import { truncateText } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import ProductCard from "./productCard";

export default function ProductPageClient({
  locale,
  path,
  translations,
  productData,
  localizedName,
  localizedDesc,
  localizedNameCategory,
}) {
  const searchParams = useSearchParams();
  const spot = searchParams.get("spot");
  const table_id = searchParams.get("table_id");
  const table_num = searchParams.get("table_num");
  const service = searchParams.get("service");

  return (
    <Container className="w-11/12 flex-col justify-start items-start pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={
                path?.place !== "branch"
                  ? `/${locale}/${path?.place}/category`
                  : `/${locale}/${path?.place}/category?spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
              }
            >
              <h1 className="font-bold textSmall3">{translations.categories}</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator size={48} />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={
                path?.place !== "branch"
                  ? `/${locale}/${path?.place}/category?category_id=${productData?.menu_category_id}`
                  : `/${locale}/${path?.place}/category?category_id=${productData?.menu_category_id}&spot=${spot}&table_id=${table_id}&table_num=${table_num}&service=${service}`
              }
            >
              <h1 className="font-bold textSmall3">{localizedNameCategory}</h1>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator size={48} />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h1 className="font-bold textSmall3">
                {truncateText(localizedName, 50)}
              </h1>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductCard
        localizedName={localizedName}
        localizedDesc={localizedDesc}
        productData={productData}
        place={path.place}
      />
    </Container>
  );
}