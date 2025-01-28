import Container from "@/components/shared/container";
import Image from "next/legacy/image";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import OrderDataComponent from "./_components/orderDataComponent";

async function CreateReview({params}) {
  const [locale, path,allT, aboutUsT] = await Promise.all([
    getLocale(),
    params,
    getTranslations("All"),
    getTranslations("AboutUsPage"),
  ]);
  return (
    <Container className={`flex-col items-start py-10 min-h-[400px] justify-center`}>
      <h1 className="text-xl md:text-2xl text-muted font-semibold">
        {allT("reviews")}
      </h1>
      <Container className={"w-full items-start gap-10 justify-between mt-5"}>
        <section className="w-full">
          <OrderDataComponent locale={locale} path={path}/>
          
        </section>
        {/* <section className="hidden sm:block pt-10 w-[30%] space-y-6">
          <Image
            src={`/assets/aboutLogo.svg`}
            alt={`aboutlogo`}
            width={500}
            height={100}
            className="w-[400px] aspect-[4/1]"
          />
          <p className="font-semibold text-muted text-center">
            {aboutUsT("logoBottom")}
          </p>
        </section> */}
      </Container>
    </Container>
  );
}

export default CreateReview;
