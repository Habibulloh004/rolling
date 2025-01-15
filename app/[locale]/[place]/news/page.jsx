import { getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import PromotionCards from "./_components/cards";
import { View } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const news = [
  {
    id: 1,
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil repellendus eius nostrum id blanditiis.Qui sit incidunt consequuntur id deleniti officiis voluptas mollitia, sint, voluptate aspernatur voluptatum facilis velit libero commodi doloremque.",
    title: "Новости",
    text: "Новости",
    date: "03.12.2024",
    view: 440,
  },
  {
    id: 2,
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil repellendus eius nostrum id blanditiis.Qui sit incidunt consequuntur id deleniti officiis voluptas mollitia, sint, voluptate aspernatur voluptatum facilis velit libero commodi doloremque.",
    title: "Новости",
    text: "Новости",
    date: "03.12.2024",
    view: 440,
  },
  {
    id: 3,
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil repellendus eius nostrum id blanditiis.Qui sit incidunt consequuntur id deleniti officiis voluptas mollitia, sint, voluptate aspernatur voluptatum facilis velit libero commodi doloremque.",
    title: "Новости",
    text: "Новости",
    date: "03.12.2024",
    view: 440,
  },
  {
    id: 4,
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil repellendus eius nostrum id blanditiis.Qui sit incidunt consequuntur id deleniti officiis voluptas mollitia, sint, voluptate aspernatur voluptatum facilis velit libero commodi doloremque.",
    title: "Новости",
    text: "Новости",
    date: "03.12.2024",
    view: 440,
  },
  {
    id: 5,
    description:
      " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil repellendus eius nostrum id blanditiis.Qui sit incidunt consequuntur id deleniti officiis voluptas mollitia, sint, voluptate aspernatur voluptatum facilis velit libero commodi doloremque.",
    title: "Новости",
    text: "Новости",
    date: "03.12.2024",
    view: 440,
  },
];

const News = async () => {
  const [bannersData, newsT] = await Promise.all([
    getData("/banner/get_banners"),
    getTranslations("NewsPage"),
  ]);

  const banners = bannersData.banners;
  return (
      <Container className={`w-full flex-col items-start pb-4`}>
        <Banner banners={banners} />{" "}
        <h1 className="w-11/12 mx-auto text-muted text-xl md:text-2xl font-semibold">
          {newsT("title")}
        </h1>
        <Carousel
          opts={{
            align: "center",
          }}
          className="relative w-full text-foreground mt-5 md:mt-10 "
          paginate={"false"}
        >
          {/* <div className="absolute -right-1 -top-4 w-2 h-48 bg-[#F5F5F5] z-50 shadow-custom" /> */}
          <CarouselContent className="relative">
            {news.map((item, i) => {
              return (
                <CarouselItem
                  key={i}
                  className={`basis-[80%] sm:basis-[60%] md:basis-[40%] lg:basis-[30%] p-0 px-4 ${
                    i == 0 && "max-sm:ml-8 max-md:ml-16 ml-8"
                  }`}
                >
                  <PromotionCards item={item} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </Container>
  );
};

export default News;
