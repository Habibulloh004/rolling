import {
  LoginModal,
  RegisterModal,
  ResetPasswordModal,
} from "@/components/shared/customModal";
import React from "react";

const Modals = () => {
  return (
    <div className="space-x-3">
      <LoginModal />
      <RegisterModal />
      <ResetPasswordModal />
    </div>
  );
};

export default Modals;
