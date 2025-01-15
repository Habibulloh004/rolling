import React from "react";
import Products from "./products";
import Order from "./order";

const Right = ({ products, locale }) => {
  return (
    <div className="w-full flex flex-col">
      <Products products={products} locale={locale} />
      <Order />
    </div>
  );
};

export default Right;
