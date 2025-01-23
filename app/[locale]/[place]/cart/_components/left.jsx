import Payment from "./payment";
import CartSidebar from "./sidebar";

const Left = ({ place, locale, spotData, searchParamsData, auth }) => {
  return (
    <div className="w-full flex flex-col">
      <CartSidebar
        auth={auth}
        place={place}
        locale={locale}
        spotData={spotData}
        searchParamsData={searchParamsData}
      />
      <Payment place={place} locale={locale} auth={auth} />
    </div>
  );
};

export default Left;
