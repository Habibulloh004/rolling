import Payment from "./payment";
import CartSidebar from "./sidebar";

const Left = ({ place, locale }) => {
  return (
    <div className="w-full flex flex-col">
      <CartSidebar place={place} />
      <Payment place={place} locale={locale} />
    </div>
  );
};

export default Left;
