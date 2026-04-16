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
export const revalidate = 7200;

export async function generateStaticParams() {
  return ["uz", "ru", "en"].flatMap((locale) =>
    ["web", "branch"].map((place) => ({ locale, place }))
  );
}

export default async function Page({ params }) {
  const path = await params;

  return (
    <Container className="w-full mx-auto flex flex-col pt-5 gap-5">
      <CategoryComponent path={path} />
      <PopularComponent path={path} />
    </Container>
  );
}
