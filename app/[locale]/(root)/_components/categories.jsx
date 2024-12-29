"use client";
import { getLocalizedCategoryName, posterUrl } from "@/lib/utils";
import Container from "@/components/shared/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import CustomImage from "@/components/shared/customImage";
import Image from "next/legacy/image";

const Categories = ({ categories, locale }) => {
  return (
    <Container className={`mt-5 w-full`}>
      {/* Unified Carousel with updated styles */}
      <Carousel className="w-full text-foreground" paginate={"false"}>
        <CarouselContent>
          {categories.map((item, i) => {
            const localizedName = getLocalizedCategoryName(
              item.category_name,
              locale
            );
            return (
              <CarouselItem
                key={i}
                className={`basis-[15%] p-0 mx-2 bg-white rounded-xl ${
                  i == 0 && "ml-4"
                }`}
              >
                <Link
                  locale={locale}
                  href={"/hey"}
                  className="w-full aspect-square"
                >
                  <img
                    className="w-full aspect-square rounded-full p-3"
                    src={`${posterUrl}${item.category_photo}`}
                    alt={`${localizedName}`}
                  />
                  {/* <Image
                    layout="fill"
                    className="w-full aspect-square rounded-full p-3"
                    src={`${posterUrl}${item.category_photo}`}
                    alt={`${localizedName}`}
                  /> */}
                  {/* <CustomImage
                    src={`${posterUrl}${item.category_photo}`}
                    className="w-full aspect-square rounded-full p-3"
                    alt={`${localizedName}`}
                    fill
                  /> */}
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </Container>
  );
};

export default Categories;
