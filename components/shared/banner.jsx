"use client";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import emblaCarouselAutoplay from "embla-carousel-autoplay";
import CustomImage from "./customImage";

const Banner = ({ banners }) => {
  return (
    <main className={"mx-auto w-full py-3 md:py-5"}>
      <section className="flex items-center w-full justify-center h-full">
        <div className="bg-transparent rounded-xl w-full">
          <Carousel
            paginate={"false"}
            plugins={[
              emblaCarouselAutoplay({
                delay: 10000,
              }),
            ]}
            opts={{
              loop: true,
              align: "center",
            }}
            className="w-full text-secondary"
          >
            <CarouselContent className="my-0 py-0 px-2 md:px-4 lg:px-8 lg:gap-8">
              {banners.map((item, i) => (
                  <CarouselItem key={item.id ?? i} className="">
                    <div className="relative max-w-[1440px] mx-auto aspect-[15/5] rounded-[10px] sm:rounded-[20px] md:rounded-[30px] lg:rounded-[40px] xl:rounded-[50px] overflow-hidden">
                      <CustomImage
                        src={item?.imageUrl || "/empty.jpg"}
                        alt={item?.title || "banner-img"}
                        loading="eager"
                        className="w-full mx-auto aspect-video mb-5"
                        property={"true"}
                        priority={i === 0}
                        quality={80}
                        sizes="(max-width: 768px) 100vw, 1440px"
                      />
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </main>
  );
};

export default Banner;
