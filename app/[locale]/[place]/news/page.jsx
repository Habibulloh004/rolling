import { getTranslations } from "next-intl/server";
import Container from "@/components/shared/container";
import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import PromotionCards from "./_components/cards";

const News = async () => {
  const [bannersData, newsT] = await Promise.all([
    getData("/banner/get_banners"),
    getTranslations("NewsPage"),
  ]);

  const banners = bannersData.banners;
  return (
    <main>
      <Container className={`py-3 md:py-8 flex-col items-start`}>
        <h1 className="text-muted text-xl md:text-2xl font-semibold">
          {newsT("title")}
        </h1>
        <Banner banners={banners} />{" "}
        <PromotionCards />
      </Container>
    </main>
  );
};

export default News;
