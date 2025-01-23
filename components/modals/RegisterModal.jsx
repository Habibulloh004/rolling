import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RegisterForm from "../forms/RegisterForm";

export function RegisterModal() {
  const register = useTranslations("Register");
  return (
    <Dialog open className="w-full">
      <DialogTrigger asChild>
        <Button>Register modal</Button>
      </DialogTrigger>
      <DialogContent
        className="w-11/12 px-3 sm:max-w-2xl bg-primary-modal sm:w-10/12 xl:max-w-3xl sm:px-10 py-5 focus:outline-none border-0 rounded-sm sm:rounded-md"
        mark="false"
      >
        <DialogHeader className={"pt-2"}>
          <DialogTitle className="max-sm:hidden textSmall3 text-white">
            {register("title")}
          </DialogTitle>
          <DialogDescription className="max-sm:hidden text-white text-[12px] ml-3">
            {register("description")}
          </DialogDescription>
          <div className="sm:hidden text-white w-full flex justify-between items-center gap-2">
            <h1 className="textNormal4 font-[400]">
              {register("registeration")}
            </h1>
          </div>
        </DialogHeader>
        <RegisterForm />
      </DialogContent>
    </Dialog>
  );
}
