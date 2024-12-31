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
import { ChevronRight } from "lucide-react";

const Categories = ({ categories, locale }) => {
  console.log(categories);

  return (
    <Container className={`mt-3 md:mt-5 w-full md:w-10/12 flex-col gap-3 pb-4`}>
      <div className="w-11/12 md:w-full flex justify-between items-center gap-3">
        <h1 className="font-bold text-thin textNormal4">Категории</h1>
        <Link
          locale={locale}
          href={"/hey"}
          className="flex justify-end items-center gap-1 text-primary textSmall font-medium"
        >
          Увидеть больше
          <ChevronRight size={18} />
        </Link>
      </div>
      <Carousel
        className="relative w-full text-foreground mt-4 md:mt-12 "
        paginate={"false"}
      >
        <div className="max-md:hidden absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" />
        <CarouselContent className="relative max-md:px-4">

                className={`basis-auto lg:basis-1/3 xl:basis-[25%] 2xl:basis-[15%] p-0 mx-2 rounded-xl ${
                  i == 0 && "ml-4"
                }`}
              >
                <Link
                  locale={locale}
                  href={"/hey"}
                  className="relative flex justify-center items-center flex-col gap-2"
                >
                  <div className="overflow-hidden rounded-md bg-white p-2">
                    <div className="relative w-32 h-32 xl:w-40 xl:h-40 rounde">
                      <CustomImage
                        src={`${posterUrl}${item.category_photo}`}
                        className="object-cover rounded-full"
                        alt={`${localizedName}`}
                      />
                    </div>
                  </div>
                  <h1 className="font-bold textNormal2 md:textSmall3 text-thin">Category name</h1>
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
