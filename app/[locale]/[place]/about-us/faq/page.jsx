import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/shared/container";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Часто задаваемые вопросы - Rolling Sushi",
  description:
    "Найдите ответы на популярные вопросы о меню, доставке, бонусах и работе Rolling Sushi в Ташкенте.",
  keywords:
    "вопросы и ответы, FAQ Rolling Sushi, бонусы, доставка суши, меню",
};

export default async function Faq({ params }) {
  const [param, questionsT, questions] = await Promise.all([
    params,
    getTranslations("FAQ"),
    getTranslations("FAQ.questions"),
  ]);
  const questionArray = [
    {
      id: 1,
      question: questions("q0_question"),
      answer: questions("q0_answer")
    },
    {
      id: 2,
      question: questions("q1_question"),
      answer: questions("q1_answer")
    },
    {
      id: 3,
      question: questions("q2_question"),
      answer: questions("q2_answer")
    },
    {
      id: 4,
      question: questions("q3_question"),
      answer: questions("q3_answer")
    },
    {
      id: 5,
      question: questions("q4_question"),
      answer: questions("q4_answer")
    },
    {
      id: 6,
      question: questions("q5_question"),
      answer: questions("q5_answer")
    },
    {
      id: 7,
      question: questions("q6_question"),
      answer: questions("q6_answer")
    },
    {
      id: 8,
      question: questions("q7_question"),
      answer: questions("q7_answer")
    },
    {
      id: 9,
      question: questions("q8_question"),
      answer: questions("q8_answer")
    },
    {
      id: 10,
      question: questions("q9_question"),
      answer: questions("q9_answer")
    },
    {
      id: 11,
      question: questions("q10_question"),
      answer: questions("q10_answer")
    },
    {
      id: 12,
      question: questions("q11_question"),
      answer: questions("q11_answer")
    },
  ]

  // FAQ ichidagi savollarni olish
  return (
    <Container className={"flex flex-col items-start my-4"}>
      <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032]">
        {questionsT("title")}
      </h1>
      <Accordion type="single" collapsible className=" w-full lg:w-2/3 mt-8">
        {questionArray.map((key, i) => (
          <AccordionItem key={key.id} value={`item-${i}`}>
            <AccordionTrigger className={"underline-offset-4"}>
              <p className="text-sm md:text-lg font-semibold underline-none">{key.question}</p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="text-xs md:text-base font-normal">
                {key.answer.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

        ))}

      </Accordion>

      <h5 className="text-xs md:text-base font-semibold text-start w-full lg:w-2/3 mt-8 text-[#004032]">{questionsT("text")}</h5>
    </Container>
  );
};

