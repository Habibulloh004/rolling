import Banner from "@/components/shared/banner";
import { getData } from "@/service";
import { getLocale, getTranslations } from "next-intl/server";
import Categories from "./_components/categories";
import Container from "@/components/shared/container";
import Modals from "./_components/modals";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";

export const metadata = {
  title: "Rolling Sushi - Свежие суши и роллы в Ташкенте",
  description:
    "Rolling Sushi предлагает свежие суши, роллы и японскую кухню с доставкой и в ресторане. Узнайте о наших акциях и популярном меню!",
  keywords:
    "суши, роллы, доставка суши, японская кухня, Rolling Sushi, Ташкент, акции суши",
  alternates: {
    canonical: "https://rollingsushi.uz/",
  },
};

export default async function HomePage() {
  const [bannersData, categoriesData] = await Promise.all([
    getData("/banner/get_banners"),
    getData("/poster/categories"),
  ]);

  const banners = bannersData.banners;
  const categories = categoriesData.response.filter(
    (item) => item.category_photo != null && item.category_hidden != "1"
  );

  const [locale] = await Promise.all([getLocale()]);

  return (
    <Container className={"w-full flex-col"}>
      <Dialog>
        <DialogTrigger asChild>
          <span>
            <Link locale={locale} href={"/web/categories"}>
              Hello world
            </Link>
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-10" mark="false">
          <DialogHeader>
            <DialogTitle>product.name</DialogTitle>
            <DialogDescription className="text-[#6B6B6B]">
              product.description
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* <Banner banners={banners} /> */}
      <Categories categories={categories} locale={locale} />
      <Modals />
    </Container>
  );
}
