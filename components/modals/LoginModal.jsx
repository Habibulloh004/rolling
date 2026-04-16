import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import AuthPhoneFlowForm from "../forms/AuthPhoneFlowForm";
import { useState } from "react";

export function LoginModal() {
  const login = useTranslations("Login");
  const [open, setOpen] = useState(false);

  return (
    <Dialog className="w-full" open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label={`login modal`}>Login modal</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg w-11/12 no-scrollbar bg-primary-modal text-white overflow-y-scroll py-5 focus:outline-none border-0 rounded-sm sm:rounded-md"
        mark="false"
      >
        <DialogHeader className={""}>
          <DialogTitle className="max-sm:hidden textSmall3 text-white">
            {login("title")}
          </DialogTitle>
          <div className="sm:hidden text-white w-full">
            <h1 className="textNormal4 font-[400]">{login("title")}</h1>
          </div>
        </DialogHeader>
        <AuthPhoneFlowForm onAuthSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
