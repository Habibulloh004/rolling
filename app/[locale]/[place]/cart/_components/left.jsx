import Payment from "./payment";
import CartSidebar from "./sidebar";

const Left = ({ apiTime, place, locale, spotData, searchParamsData, auth }) => {
  return (
    <div className="w-full flex flex-col">
      <CartSidebar
        apiTime={apiTime}
        auth={auth}
        place={place}
        locale={locale}
        spotData={spotData}
        searchParamsData={searchParamsData}
      />
      <Payment apiTime={apiTime} place={place} locale={locale} auth={auth} />
    </div>
  );
};

export default Left;
