import { redirect } from "next/navigation";

export const metadata = {
  title: "Создайте аккаунт в Rolling Sushi | Бонусы новым клиентам",
  description:
    "Зарегистрируйтесь в Rolling Sushi и получите бонусы! Следите за заказами, участвуйте в акциях и получайте скидки на суши и роллы.",
  keywords:
    "регистрация Rolling Sushi, бонусы на суши, скидки на роллы, личный кабинет",
  alternates: {
    canonical: "https://rolling.uz/uz/web/sign-up",
    ru: "https://rolling.uz/ru/web/sign-up",
    en: "https://rolling.uz/en/web/sign-up",
  },
};

export default async function SignUp({ params }) {
  const path = await params;
  redirect(`/${path.locale}/${path.place}`);
}
