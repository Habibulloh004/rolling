import Container from '@/components/shared/container'
import { getLocale, getTranslations } from 'next-intl/server';
import React from 'react'

export const metadata = {
  title: "Политика конфиденциальности - Rolling Sushi",
  description:
    "Узнайте, как Rolling Sushi обрабатывает и защищает ваши данные при использовании нашего сайта и приложения.",
  keywords: "политика конфиденциальности, защита данных, Rolling Sushi",
};

const Policy = async () => {
  const [ descriptionT, policyT] = await Promise.all([
    getTranslations("Policy.description"),
    getTranslations("Policy"),
    getLocale()
  ]);

  const descriptionArray = [
    {
      id: 1,
      title: descriptionT("0_title"),
      text: descriptionT("0_text")
    },
    {
      id: 2,
      title: descriptionT("1_title"),
      text: descriptionT("1_text")
    },
    {
      id: 3,
      title: descriptionT("2_title"),
      text: descriptionT("2_text")
    },
    {
      id: 4,
      title: descriptionT("3_title"),
      text: descriptionT("3_text")
    },
    {
      id: 5,
      title: descriptionT("4_title"),
      text: descriptionT("4_text")
    },
  ]
  return (
    <Container className={"flex flex-col pt-5"}>
      <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032]">
        {policyT("title")}
      </h1>

      <div className='mt-10 flex flex-col gap-y-5 '>

        {descriptionArray.map((item, i) => (
          <div as="div" key={i}>
            <p className="text-base lg:test-lg text-start font-medium w-5/6 leading-7">{item.title}</p>

            {item.text.split('\n').map((line, idx) => (
              <p className="text-xs md:text-base font-normal text-start" key={idx}>{line}</p>
            ))}
          </div>))}
      </div>


    </Container>
  )
}

export default Policy