import CategoryComponent from "./_components/categoryComponent";
import PopularComponent from "./_components/popularComponent";
import Container from "@/components/shared/container";

export const metadata = {
  title: "Меню Rolling Sushi – суши, роллы, WOK и сеты | Доставка за 40 мин",
  description:
    "🍣 Лучшее меню суши и роллов в Ташкенте! Выбирайте из классических, запечённых и горячих роллов, WOK, сетов и эксклюзивных новинок. 🚀 Бесплатная доставка по акции или за 40 минут – либо ролл в подарок! 🎁 Бонусная система до 10% кешбэка. rolling.uz – закажите сейчас!",
  keywords:
    "суши-сеты, роллы, доставка суши Ташкент, выгодные сеты, японская кухня, Rolling Sushi",
  alternates: {
    canonical: "https://rolling.uz/uz/web/category",
    ru: "https://rolling.uz/ru/web/category",
    en: "https://rolling.uz/en/web/category",
  },
};

export const experimental_ppr = true;

export async function generateStaticParams() {
  return [
    { locale: "uz", place: "web" },
    { locale: "ru", place: "web" },
    { locale: "en", place: "web" },
  ];
}

export default async function Page({ params, searchParams }) {
  const [path, searchParamsData] = await Promise.all([params, searchParams]);

  return (
    <Container className="w-11/12 mx-auto flex flex-col pt-5 gap-5">
      <CategoryComponent searchParamsData={searchParamsData} path={path} />
      <PopularComponent searchParamsData={searchParamsData} path={path} />
    </Container>
  );
}
