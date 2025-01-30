"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { getUrl } from "@/lib/utils";
import { useOrderStore } from "@/store";
import { Textarea } from "@/components/ui/textarea";

// Custom user marker
const userMarker = new Icon({
  iconUrl:
    "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
  iconSize: [60, 60],
});

const EditAddress = () => {
  const [open, setOpen] = useState(true);
  const { orderData, setOrderData } = useOrderStore();
  const [addressData, setAddressData] = useState({
    id: 0,
    address: "",
    lat: null,
    lng: null,
    house: "",
  });

  const [location, setLocation] = useState({
    lat: 41.311081,
    lng: 69.240562,
  });

  const addressT = useTranslations("Profile.Address");
  const allT = useTranslations("All");
  const pathname = usePathname();
  const router = useRouter();
  console.log(pathname.split("/"));

  const SmoothTransition = ({ lng, lat, zoom = 14 }) => {
    const map = useMap();
    if (lat && lng) {
      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    }
    return null;
  };

  const handleFoundLocation = () => {
    if (!navigator.geolocation) {
      toast.warning(addressT("geolocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        localStorage.setItem("yourLocation", JSON.stringify(newLocation));
      },
      (error) => {
        if (!navigator.geolocation) {
          toast.warning(addressT("geolocation"));
          return;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    const myAddresses = localStorage.getItem("myAddresses")
      ? JSON.parse(localStorage.getItem("myAddresses"))
      : [];
    // Validation
    if (!addressData.address) {
      toast.error(addressT("address_error"));
      return;
    }
    if (!addressData.lat || !addressData.lng) {
      toast.error(addressT("location_error"));
      return;
    }

    const id = myAddresses.length + 1;
    let commentAddress;
    if (addressData.house) {
      commentAddress = addressData.house + ". ";
    }
    if (addressData?.comment) {
      commentAddress += addressData?.comment + ". ";
    }
    const newAddress = {
      id,
      address: addressData.address,
      lat: addressData.lat,
      lng: addressData.lng,
      comment: commentAddress ? commentAddress : "",
    };

    myAddresses.push(newAddress);
    localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
    toast.success(addressT("address_saved"));
    router.push(`${getUrl(pathname)}/cart`);
    setOrderData({
      ...orderData,
      address: addressData.address,
      client_addresses_id: id,
      lat: addressData.lat,
      lng: addressData.lng,
      address_comment: commentAddress ? commentAddress : "",
    });

    // Reset form
    setAddressData({
      id: 0,
      address: "",
      lat: null,
      lng: null,
      house: "",
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  // const MapClickHandler = () => {
  //   useMapEvents({
  //     click(e) {
  //       const { lat, lng } = e?.latlng;
  //       setLocation({ lat, lng });
  //       localStorage.setItem("yourLocation", JSON.stringify({ lat, lng }));
  //     },
  //   });
  //   return null;
  // };

  useEffect(() => {
    const savedLocation = localStorage.getItem("yourLocation")
      ? JSON.parse(localStorage.getItem("yourLocation"))
      : null;

    if (savedLocation) {
      setLocation(savedLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          localStorage.setItem("yourLocation", JSON.stringify(newLocation));
        },
        (error) => {
          toast.warning(
            "Joylashuvni aniqlashda xatolik yuz berdi. Iltimos, ruxsat bering."
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${String(
            location?.lat
          )}&lon=${String(location?.lng)}&format=json&accept-language=${
            pathname.split("/")[1]
          }`
        );
        const addressRes = await res.json();
        console.log(addressRes?.display_name);
        setAddressData({
          ...addressData,
          lat: location.lat,
          lng: location.lng,
          address: addressRes?.display_name,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [location]);

  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="font-semibold textNormal4 text-primary w-full text-start">
        {addressT("title")}
      </h1>
      <div className="w-full flex flex-col lg:flex-row my-6 justify-around gap-5 md:gap-16">
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="address" className={"text-base leading-6"}>
            {addressT("address")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] px-2 py-1 mt-2">
            <Textarea
              id="address"
              name="address"
              type="text"
              value={addressData.address}
              onChange={handleChangeInput}
              placeholder={addressT("pls")}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <Label htmlFor="house" className={"text-base leading-6 mt-3"}>
            {addressT("house")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2  h-12">
            <Input
              id="house"
              name="house"
              type="text"
              value={addressData.house}
              onChange={handleChangeInput}
              placeholder={addressT("house_pls")}
              className={
                "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <Label htmlFor="comment" className={"text-base leading-6 mt-3"}>
            {addressT("comment")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 py-1">
            <Textarea
              id="comment"
              type="text"
              value={addressData.comment}
              onChange={handleChangeInput}
              name="comment"
              placeholder={""}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <div className="w-full hidden lg:grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-2 mt-5">
            <Button
              onClick={handleSubmit}
              className={"hover:bg-primary h-10 rounded-sm"}
            >
              {allT("add")}
            </Button>
          </div>
        </div>
        <div className="lg:w-full h-48 lg:h-80 rounded-xl overflow-hidden relative z-0 ">
          {open && (
            <div className="md:hidden absolute top-0 left-0 w-full h-full z-30 backdrop-blur-[1px] bg-black/10 flex justify-center items-center">
              <Button onClick={() => setOpen(false)}>
                {addressT("select_map")}
              </Button>
            </div>
          )}
          <MapContainer
            center={[41.2995, 69.2401]}
            zoom={16}
            scrollWheelZoom
            style={{ height: "100%", width: "100%", zIndex: 10 }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SmoothTransition
              lng={location?.lng}
              lat={location?.lat}
              zoom={14}
            />
            <Marker
              icon={userMarker}
              position={
                location?.lat && location?.lng
                  ? [location.lat, location.lng]
                  : [41.2995, 69.2401]
              }
            >
              {/* <Popup>{addressT("you_here")}</Popup> */}
            </Marker>
            {/* <MapClickHandler /> */}
          </MapContainer>
          <Button
            onClick={handleFoundLocation}
            className={
              "flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white px-3 py-2 h-10 absolute bottom-3 left-3 z-50"
            }
          >
            <Navigation size={16} />
          </Button>
        </div>
      </div>
      <div className="lg:hidden w-full flex justify-between">
        <Button
          onClick={handleSubmit}
          className={"hover:bg-primary h-10 rounded-sm"}
        >
          {allT("add")}
        </Button>
      </div>
    </Container>
  );
};

export default EditAddress;
