import CategoryComponent from "./_components/categortComponent";
import PopularComponent from "./_components/popularComponent";
import Container from "@/components/shared/container";

export const metadata = {
  title: "Суши-сеты в Ташкенте | Выгодные предложения от Rolling Sushi",
  description:
    "Попробуйте наши суши-сеты – идеальный выбор для компании! Выгодные цены, быстрая доставка в Ташкенте. Заказывайте прямо сейчас!",
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
    <Container className="w-full sm:w-11/12 flex flex-col pt-5 space-y-3">
      <CategoryComponent searchParamsData={searchParamsData} path={path} />
      <PopularComponent searchParamsData={searchParamsData} path={path} />
    </Container>
  );
}
