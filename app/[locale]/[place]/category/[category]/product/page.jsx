import ErrorPage from "@/components/error/customError";
import React from "react";

export default function ProductPage() {
  return (
    <div>
      <ErrorPage code={404}  />
    </div>
  );
}
