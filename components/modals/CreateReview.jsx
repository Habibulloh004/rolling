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
import ReviewForm from "../forms/ReviewForm";
import { getTranslations } from "next-intl/server";
import { DialogDescription } from "@radix-ui/react-dialog";

export async function CreateReview() {
  const [aboutUsT, allT] = await Promise.all([
    getTranslations("AboutUsPage"),
    getTranslations("All"),
  ]);

  return (
    <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button>{aboutUsT("btnReview")}</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md w-11/12 no-scrollbar overflow-y-scroll p-7 focus:outline-none border-0 rounded-sm sm:rounded-md"
        mark="false"
      >
        <DialogHeader className={""}>
          <DialogTitle className="max-sm:hidden textSmall3">
            {allT("reviews")}
          </DialogTitle>
          <div className="sm:hidden text-white w-full flex justify-between items-center gap-2">
            <h1 className="textNormal4 font-[400]">{allT("reviews")}</h1>
          </div>
        </DialogHeader>

        <ReviewForm />
      </DialogContent>
    </Dialog>
  );
}
