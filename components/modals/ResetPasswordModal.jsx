import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import ResetPasswordForm from "../forms/ResetPasswordForm";

export function ResetPasswordModal() {
  const login = useTranslations("ResetPassword");

  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button>Reset Password modal</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md w-11/12 no-scrollbar bg-primary-modal overflow-y-scroll py-5 focus:outline-none border-0 rounded-sm sm:rounded-md"
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
        <ResetPasswordForm />
      </DialogContent>
    </Dialog>
  );
}