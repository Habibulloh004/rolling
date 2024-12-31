import { cn } from "@/lib/utils";
import React from "react";

const Container = ({ children, className }) => {
  return (
    <div
      className={cn(
        `w-10/12 max-w-[1440px] mx-auto flex justify-between items-center`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
