import Payment from "./payment";
import CartSidebar from "./sidebar";

const Left = ({ place, locale, spotData, searchParamsData }) => {
  return (
    <div className="w-full flex flex-col">
      <CartSidebar
        place={place}
        locale={locale}
        spotData={spotData}
        searchParamsData={searchParamsData}
      />
      <Payment place={place} locale={locale} />
    </div>
  );
};

export default Left;
