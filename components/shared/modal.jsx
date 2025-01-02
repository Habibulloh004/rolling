"use client";

import { Dialog, DialogOverlay, DialogContent } from "../ui/dialog";
import { useRouter } from "next/navigation";

export function Modal({ children }) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={false} open={false} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="overflow-y-hidden">{children}</DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
