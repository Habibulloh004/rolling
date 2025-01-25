"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import MyMap from "../../_components/map";
import { useTranslations } from "use-intl";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function MyAddressComponent() {
  const allT = useTranslations("All");
  const [addressData, setAddressData] = useState([]);
  const handleDeleteAddress = (id) => {
    let updatedAddresses = addressData.filter((address) => address.id !== id);
    localStorage.setItem("myAddresses", JSON.stringify(updatedAddresses));
    toast.success("Address deleted successfully");
    setAddressData(updatedAddresses);
  };

  useEffect(() => {
    let addresses = localStorage.getItem("myAddresses")
      ? JSON.parse(localStorage.getItem("myAddresses"))
      : [];
    setAddressData(addresses);
  },[]);
  return (
    <div>
      <div className="w-full hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {addressData?.map((item, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="w-full overflow-hidden min-w-[266px] h-[180px] rounded-2xl relative">
                <MyMap
                  latitude={item.lat}
                  longitude={item.lng}
                  address={item?.address}
                />
                <div className="h-full w-full absolute top-0 z-20"></div>
              </div>
              <CardTitle className={"textSmall3 font-bold"}>
                {item.name}
              </CardTitle>
              <CardDescription
                className={"text-[#2E2E2E] textSmall2 font-semibold"}
              >
                {item.address}
              </CardDescription>
            </CardHeader>
            <CardFooter className={"grid grid-cols-1 gap-y-4  w-full gap-x-2"}>
              <Button
                onClick={() => handleDeleteAddress(item?.id)}
                className={"hover:bg-primary"}
              >
                {allT("delete")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="lg:hidden w-full mx-2"
      >
        <CarouselContent>
          {addressData?.map((item, i) => (
            <CarouselItem key={i} className="basis-80 md:basis-auto ">
              <div className="p-1">
                <Card key={i}>
                  <CardHeader>
                    <div className="w-full overflow-hidden min-w-[266px] h-[180px] rounded-2xl relative">
                      <MyMap
                        latitude={item.lat}
                        longitude={item.lng}
                        address={item?.address}
                      />
                      <div className="h-full w-full absolute top-0 z-20"></div>
                    </div>
                    <CardTitle className={"text-xl font-bold"}>
                      {item.name}
                    </CardTitle>
                    <CardDescription
                      className={"text-[#2E2E2E] text-sm font-semibold"}
                    >
                      {item.address}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter
                    className={
                      "grid grid-cols-1 gap-y-4 lg:grid-cols-2 w-full gap-x-2"
                    }
                  >
                    <Button
                      onClick={() => handleDeleteAddress(item?.id)}
                      className={"hover:bg-primary"}
                    >
                      {allT("delete")}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
