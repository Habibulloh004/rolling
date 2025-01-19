import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import LoginForm from "../forms/LoginForm";

export function LoginModal() {
  const login = useTranslations("Login");

  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button>Login modal</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg w-11/12 no-scrollbar bg-primary-modal overflow-y-scroll py-5 focus:outline-none border-0 rounded-sm sm:rounded-md"
        mark="false"
      >
        <DialogHeader className={""}>
          <DialogTitle className="max-sm:hidden textSmall3 text-white">
            {login("title")}
          </DialogTitle>
          <div className="sm:hidden text-white w-full flex justify-between items-center gap-2">
            <h1 className="textNormal4 font-[400]">{login("title")}</h1>
            <p>lang</p>
          </div>
        </DialogHeader>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
