import React from "react";
import Products from "./products";
import Order from "./order";

const Right = ({ products, locale, auth, searchParamsData }) => {
  return (
    <div className="w-10/12 flex flex-col">
      <Products products={products} locale={locale} auth={auth} />
      <div className="h-[1px] bg-foreground/10 w-full" />
      <Order searchParamsData={searchParamsData} auth={auth} />
    </div>
  );
};

export default Right;
