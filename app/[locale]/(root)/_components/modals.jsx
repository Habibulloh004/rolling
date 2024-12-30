import { LoginModal, RegisterModal } from "@/components/shared/customModal";
import { Button } from "@/components/ui/button";
import React from "react";

const Modals = () => {
  return (
    <div>
      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default Modals;
