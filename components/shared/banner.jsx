"use client";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import { getUrl, url } from "@/lib/utils";
import CustomImage from "./customImage";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Banner = ({ banners }) => {
  console.log(banners);

  const pathname = usePathname();
  return (
    <main className={"mx-auto w-full py-3 md:py-5"}>
      <section className="flex items-center w-full justify-center h-full">
        {/* Mobile View */}
        <div className="bg-transparent rounded-xl w-full">
          <Carousel
            paginate={"false"}
            plugins={[
              emblaCarouselAutoplay({
                delay: 3000,
              }),
            ]}
            opts={{
              loop: true, // Loopni qo'shish
              align: "center",
            }}
            className="w-full text-secondary"
          >
            <CarouselContent className="my-0 py-0 px-2 md:px-4 lg:px-8 lg:gap-8">
              {banners.map((item, i) => {
                return (
                  <CarouselItem key={i} className="">
                    <Link className="mt-1" href={`${getUrl(pathname)}/news`}>
                      <div className="relative max-w-[1440px] mx-auto aspect-[15/5] rounded-[10px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px] xl:rounded-[50px] overflow-hidden">
                        <CustomImage
                          src={`${url}/banner/get_banner/${item.id}`}
                          alt={`banner-img`}
                          fill
                          className="w-full mx-auto aspect-video mb-5"
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default Banner;
