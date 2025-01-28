import Container from '@/components/shared/container';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import React from 'react';

export default async function Terms({ params }) {
    const [param, termsY, termsT] = await Promise.all([
        params,
        getTranslations("TermsOfService"),
        getTranslations("TermsOfService.sections"),
    ]);

    return (
        <Container className="flex flex-col items-start gap-5 my-4">
            <h1 className="text-xl md:text-2xl font-bold text-start w-full text-[#004032]">{termsY("title")}</h1>
            <p className='font-bold lg:text-xl'>{termsY("effective_date")}</p>
            <p className='font-bold lg:text-xl'>{termsY("text")}</p>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section1.title")}</h2>
                <p>{termsT("section1.text")}</p>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section2.title")}</h2>
                <ul>
                    <li>{termsT("section2.subsections.21")}</li>
                    <li>{termsT("section2.subsections.22")}</li>
                    <li>{termsT("section2.subsections.23")}</li>
                </ul>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl '>{termsT("section3.title")}</h2>
                <ul >
                    <li className='pb-5'>{termsT("section3.subsections.31")}</li>
                    <li>
                        <h3 className='font-semibold lg:text-xl'>{termsT("section3.subsections.32.title")}</h3>
                        <ul>                            
                                <li>{termsT("section3.subsections.32.methods.Cash")}</li>
                                <li>{termsT("section3.subsections.32.methods.Online")}</li>

                        </ul>
                    </li>
                    <li>{termsT("section3.subsections.33")}</li>
                </ul>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section4.title")}</h2>
                <ul>
                    <li>{termsT("section4.subsections.41")}</li>
                    <li>{termsT("section4.subsections.42")}</li>
                </ul>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section5.title")}</h2>
                <ul>
                    <li>{termsT("section5.subsections.51")}</li>
                    <li>{termsT("section5.subsections.52")}</li>
                </ul>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section6.title")}</h2>
                <p>{termsT("section6.text")}</p>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section7.title")}</h2>
                <p>{termsT("section7.text")}</p>
            </div>

            <div>
                <h2 className='font-semibold lg:text-xl'>{termsT("section8.title")}</h2>
                <ul className='flex flex-col'>
                    <li>{termsT("section8.details.email")}</li>
                    <a href="tel:+998771244444">{termsT("section8.details.phone")}</a>
                    <li>{termsT("section8.details.address")}</li>
                </ul>
            </div>

            <p>{termsY("closing")}</p>
        </Container>
    );
}
