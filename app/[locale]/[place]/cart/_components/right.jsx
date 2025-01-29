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
}) => {
  return (
    <div className="w-10/12 flex flex-col">
      <Products products={products} locale={locale} auth={auth} place={place} />
      <div className="h-[1px] bg-foreground/10 w-full" />
      <Order
        spotDataFilial={spotData}
        searchParamsData={searchParamsData}
        auth={auth}
        locale={locale}
        place={place}
      />
    </div>
  );
};

export default Right;
