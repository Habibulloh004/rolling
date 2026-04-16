import Container from "@/components/shared/container";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiService } from "@/service/api.services";
import { cookies } from "next/headers";
import { getLocalizedProduct } from "@/lib/utils";
import { getSafeApiTime } from "@/lib/safe-api-time";
import { cacheDurations } from "@/lib/cache-config";
import CartResponsive from "./_components/CartResponsive";

export const metadata = {
  title: "Ваш заказ в Rolling Sushi | Проверьте корзину перед оплатой",
  description:
    "Проверьте ваш заказ в Rolling Sushi и оформите быструю доставку суши в Ташкенте. Свежесть и качество гарантированы!",
  keywords:
    "корзина заказа, оформить заказ суши, доставка еды Ташкент, Rolling Sushi",
  alternates: {
    canonical: "https://rolling.uz/uz/web/cart",
    ru: "https://rolling.uz/ru/web/cart",
    en: "https://rolling.uz/en/web/cart",
  },
};

const Basket = async ({ params, searchParams }) => {
  const path = await params;
  const searchParamsData = await searchParams;
  const cookieStore = await cookies();
  const cookiesData = cookieStore.get("client");

  const auth = cookiesData ? JSON.parse(cookiesData.value) : {};

  const [
    cart,
    products,
    categories,
    promotions,
    locale,
    all,
    apiTime,
  ] = await Promise.all([
    getTranslations("Cart"),
    ApiService.getPosterData("menu.getProducts", "", cacheDurations.products),
    ApiService.getPosterData(
      "menu.getCategories",
      "",
      cacheDurations.categories
    ),
    ApiService.getPosterData(
      "clients.getPromotions",
      "",
      cacheDurations.promotions
    ),
    getLocale(),
    getTranslations("All"),
    getSafeApiTime(process.env.NEXT_PUBLIC_URL_RENDER),
  ]);
  let spotData;
  if (path.place === "branch") {
    spotData = await ApiService.getPosterData(
      "spots.getSpot",
      `&spot_id=${searchParamsData.spot}`,
      cacheDurations.spots
    );
  }
  const productsIng = products?.response?.filter((item) => {
    const findIngr = item?.ingredients?.find(
      (ingr) => ingr?.ingredient_id == 213
    );
    if (
      item.photo_origin != null &&
      item?.menu_category_id != 0 &&
      findIngr &&
      item?.hidden == 0
    ) {
      return true;
    } else {
      return false;
    }
  });
  return (
    <>
      <Container
        className={"w-11/12 flex flex-col md:gap-5 pt-4 md:pt-8 gap-2"}
      >
        <h1 className="w-full text-primary font-bold font-Poppins leading-10 text-start textNormal4">
          {cart("title")}
        </h1>
        <CartResponsive
          apiTime={apiTime}
          auth={auth}
          path={path}
          locale={locale}
          spotData={spotData}
          searchParamsData={searchParamsData}
          promotions={promotions}
          productsData={products.response}
          categoriesData={categories.response}
          productsIng={productsIng}
          cartIngredientLabel={all("cart_ingredient")}
        />
      </Container>
    </>
  );
};

export default Basket;
