"use server"
import Container from '@/components/shared/container';
import { ApiService } from '@/service/api.services';
import { getLocale, getTranslations } from 'next-intl/server';
import ClientContact from './_componenets/clientContact';

const Contact = async ({params}) => {
  // Serverdan ma'lumotlarni olish
  const [param, spotData,locale] = await Promise.all([
    params,
    ApiService.getPosterData("spots.getSpots"),
    getLocale()
  ]);

  // Ma'lumotlarni Client Componentga uzatish
  return (
    <Container>
      <ClientContact spotData={spotData.response} locale={locale}/>
    </Container>
  );
};

export default Contact;
