import { CategoryModal } from "@/components/modals/CategoryModal";
import FavoriteModal from "@/components/modals/FavoriteModal";
import { LoginModal } from "@/components/modals/LoginModal";
import ProductDetailModal from "@/components/modals/ProductDetailModal";
import { RegisterModal } from "@/components/modals/RegisterModal";
import { ResetPasswordModal } from "@/components/modals/ResetPasswordModal";
import React from "react";

const Modals = ({ categories, locale }) => {
  return (
    <div className="space-x-3 flex flex-col gap-2">
      <LoginModal />
      <RegisterModal />
      <ResetPasswordModal />
      <CategoryModal categories={categories} locale={locale} />
      <FavoriteModal categories={categories} locale={locale} />
      <ProductDetailModal categories={categories} locale={locale} />
    </div>
  );
};

export default Modals;
