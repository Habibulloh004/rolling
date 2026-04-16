import Container from "@/components/shared/container";
import { ApiService } from "@/service/api.services";
import { getLocale, getTranslations } from "next-intl/server";
import ClientContact from "./_componenets/clientContact";
import { cacheDurations } from "@/lib/cache-config";

export const metadata = {
  title: "Контакты | Rolling Sushi Ташкент",
  description:
    "Наши рестораны в Ташкенте. Телефоны, адреса, часы работы. Закажите суши с доставкой или посетите нас лично.",
  keywords:
    "контакты, Rolling Sushi, Ташкент, адреса ресторанов, доставка еды, время работы",
};

export default async function Contact({ params }) {
  // Serverdan ma'lumotlarni olish
  const [param, spotData, locale] = await Promise.all([
    params,
    ApiService.getPosterData("spots.getSpots", "", cacheDurations.spots),
    getLocale(),
  ]);

  // Ma'lumotlarni Client Componentga uzatish
  return (
    <Container>
      <ClientContact spotData={spotData?.response || []} locale={locale} />
    </Container>
  );
}
