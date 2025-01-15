import Payment from "./payment";
import CartSidebar from "./sidebar";

const Left = () => {
  return (
    <div className="w-full flex flex-col">
      <CartSidebar />
      <Payment />
    </div>
  );
};

export default Left;
