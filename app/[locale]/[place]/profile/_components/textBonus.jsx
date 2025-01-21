"use client";

import React from "react";
import { useTranslations } from "use-intl";

const TextBonus = ({ className }) => {
  const bonusText = useTranslations("Profile.Bonus");
  return (
    <div className={className}>
      <div className="lg:w-[460px]">
        <p className="text-base font-medium text-[#004032]">
          {bonusText("title")}
        </p>
        <p className="text-base font-medium text-[#004032]">
          {bonusText("bonus_1")}
        </p>
        <p className="text-base font-medium text-[#004032]">
          {bonusText("bonus_2")}
        </p>
        <p className="text-base font-medium text-[#004032]">
          {bonusText("bonus_3")}
        </p>
      </div>

      <div className="lg:w-[460px]">
        <p className="text-base font-medium text-[#004032]">
          {bonusText("how_it_work")}
        </p>
        <p className="text-base font-medium text-[#004032]">
          {bonusText("work_1")}
        </p>
        <p className="text-base font-medium text-[#004032]">
          {bonusText("work_2")}
        </p>
      </div>
    </div>
  );
};

export default TextBonus;
