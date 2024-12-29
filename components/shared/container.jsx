import { cn } from "@/lib/utils";
import React from "react";

const Container = ({ children, className }) => {
  return (
    <div
      className={cn(
        `w-10/12 mx-auto flex justify-between items-center`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
