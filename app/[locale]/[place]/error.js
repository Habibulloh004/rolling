"use client";
import ErrorPage from "@/components/error/customError";
import Custom500 from "@/components/error/customError";

// Error boundaries must be Client Components
export default function Error() {
  return (
    <div>
      <ErrorPage code={500} />
    </div>
  );
}
