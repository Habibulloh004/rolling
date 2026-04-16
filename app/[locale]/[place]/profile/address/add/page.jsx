"use client";
import dynamic from "next/dynamic";

const EditAddress = dynamic(() => import("./_components/editAddress"), {
  ssr: false,
  loading: () => (
    <div className="w-11/12 mx-auto flex flex-col pt-3 md:pt-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="w-full flex flex-col lg:flex-row my-6 gap-5 md:gap-16">
        <div className="w-full flex flex-col gap-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 w-full max-w-xl bg-gray-100 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="hidden lg:block lg:w-full h-80 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  ),
});

export default function AddAddressPage() {
  return <EditAddress />;
}
