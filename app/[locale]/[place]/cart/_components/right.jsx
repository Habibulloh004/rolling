import React from "react";
import Products from "./products";
import Order from "./order";

const Right = ({
  products,
  locale,
  auth,
  searchParamsData,
  place,
  spotData,
  promotions,
  productsData,
  apiTime,
}) => {
  return (
    <div className="w-10/12 flex flex-col">
      <Products
        apiTime={apiTime}
        products={products}
        locale={locale}
        auth={auth}
        place={place}
      />
      <div className="h-[1px] bg-foreground/10 w-full" />
      <Order
        apiTime={apiTime}
        spotDataFilial={spotData}
        searchParamsData={searchParamsData}
        auth={auth}
        locale={locale}
        place={place}
        promotions={promotions}
        productsData={productsData}
      />
    </div>
  );
};

export default Right;
