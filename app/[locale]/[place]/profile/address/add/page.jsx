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

// Custom user marker

const EditAddress = () => {
  const [open, setOpen] = useState(true);
  const userMarker = new Icon({
    iconUrl:
      "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
    iconSize: [60, 60],
  });
  const [location, setLocation] = useState({
    lat: 41.311081,
    lng: 69.240562,
  });
  const addressT = useTranslations("Profile.Address");
  const allT = useTranslations("All");

  const SmoothTransition = ({ lng, lat, zoom = 14 }) => {
    const map = useMap();
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
    return null;
  };

  const handleFoundLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokatsiya sizning brauzeringizda qo'llab-quvvatlanmaydi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        localStorage.setItem(
          "yourLocation",
          JSON.stringify({ lat: latitude, lng: longitude })
        );
      },
      (error) => {
        console.error(
          "Joylashuvni aniqlashda xatolik yuz berdi:",
          error.message
        );
        alert(
          "Joylashuvni aniqlashda xatolik yuz berdi. Iltimos, ruxsat bering."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log(e.latlng)
        setLocation({ lat, lng });
        localStorage.setItem("yourLocation", JSON.stringify({ lat, lng }));
      },
    });
    return null;
  };

  useEffect(() => {
    const yourLocation = localStorage.getItem("yourLocation")
      ? JSON.parse(localStorage.getItem("yourLocation"))
      : null;

    setLocation(yourLocation);
    if (!yourLocation) {
      if (!navigator.geolocation) {
        toast.warning(
          "Geolokatsiya sizning brauzeringizda qo'llab-quvvatlanmaydi."
        );
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          localStorage.setItem(
            "yourLocation",
            JSON.stringify({ lat: latitude, lng: longitude })
          );
        },
        (error) => {
          console.error(
            "Joylashuvni aniqlashda xatolik yuz berdi:",
            error.message
          );
          alert(
            "Joylashuvni aniqlashda xatolik yuz berdi. Iltimos, ruxsat bering."
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <Container className={"w-11/12 flex flex-col pt-3 md:pt-8"}>
      <h1 className="font-semibold textNormal4 text-primary w-full text-start">
        {addressT("title")}
      </h1>
      <div className="w-full flex flex-col lg:flex-row my-6 justify-around gap-5 md:gap-16">
        <div className="w-full">
          <Label htmlFor="name" className={"text-base leading-6"}>
            {addressT("name")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={addressT("name_pls")}
              className={
                "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <Label htmlFor="address" className={"text-base leading-6"}>
            {addressT("address")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="address"
              name="address"
              type="text"
              placeholder={addressT("pls")}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <Label htmlFor="comment" className={"text-base leading-6"}>
            {addressT("comment")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] pr-7 mt-2 mb-5 h-12">
            <Input
              id="comment"
              type="text"
              placeholder={addressT("name_pls")}
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <div className="w-full hidden lg:grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-2 mt-5">
            <Button className={"hover:bg-primary h-10 rounded-sm"}>
              {allT("add")}
            </Button>
          </div>
        </div>
        <div className="lg:w-full h-48 lg:h-80 rounded-xl overflow-hidden relative z-0 ">
          {open && (
            <div className="md:hidden absolute top-0 left-0 w-full h-full z-30 backdrop-blur-[1px] bg-black/10 flex justify-center items-center">
              <Button onClick={() => setOpen(false)}>Xaritadan tanlash</Button>
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
              zoom={16}
            />
            <MapClickHandler />
            <Marker position={location} icon={userMarker}>
              <Popup>Sizning manzilingiz</Popup>
            </Marker>
          </MapContainer>
          <Button
            onClick={handleFoundLocation}
            className="absolute bottom-5 right-2 w-10 h-10 rounded-full bg-primary z-20"
          >
            <Navigation />
          </Button>
        </div>
        <div className="w-full grid lg:hidden grid-cols-1 gap-y-2 mt-10">
          <Button className={"hover:bg-primary h-10 rounded-xl"}>
            {allT("add")}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default EditAddress;
