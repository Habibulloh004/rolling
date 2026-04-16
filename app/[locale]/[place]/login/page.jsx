import { redirect } from "next/navigation";

export const metadata = {
  title: "Вход в Rolling Sushi | Личный кабинет клиента",
  description:
    "Войдите в свой личный кабинет Rolling Sushi, чтобы отслеживать заказы, управлять бонусами и получать персональные скидки.",
  keywords:
    "вход Rolling Sushi, личный кабинет, бонусная программа, заказать суши",
  alternates: {
    canonical: "https://rolling.uz/uz/web/login",
    ru: "https://rolling.uz/ru/web/login",
    en: "https://rolling.uz/en/web/login",
  },
};

export default async function Login({ params }) {
  const path = await params;
  redirect(`/${path.locale}/${path.place}`);
}
