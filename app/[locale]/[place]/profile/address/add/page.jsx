"use client";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Plus } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { getUrl } from "@/lib/utils";
import { useOrderStore } from "@/store";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Custom user marker
const userMarker = new Icon({
  iconUrl:
    "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
  iconSize: [60, 60],
});

// Center Marker component that stays fixed
const CenterMarker = () => {
  const map = useMap();

  const MapMoveMonitor = () => {
    useMapEvents({
      moveend: () => {
        const center = map.getCenter();
        const lat = center.lat;
        const lng = center.lng;

        localStorage.setItem("yourLocation", JSON.stringify({ lat, lng }));

        if (window.updateAddressFromCoordinates) {
          window.updateAddressFromCoordinates(lat, lng);
        }
      },
    });
    return null;
  };

  return (
    <>
      <MapMoveMonitor />
      <div
        className="fixed-center-marker"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundImage: `url("https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </>
  );
};

// Add this new component to handle map view updates
const MapController = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 18);
    }
  }, [location]);

  return null;
};

const EditAddress = () => {
  const [open, setOpen] = useState(false);
  const { orderData, setOrderData } = useOrderStore();
  const mapRef = useRef(null); // Ref to store map instance
  const [addressData, setAddressData] = useState({
    id: 0,
    address: "",
    lat: null,
    lng: null,
    buildingNumber: "",
    entranceNumber: "",
    floorNumber: "",
    apartmentNumber: "",
    comment: "",
  });

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

  const addressT = useTranslations("Profile.Address");
  const allT = useTranslations("All");
  const pathname = usePathname();
  const router = useRouter();

  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${String(
          lat
        )}&lon=${String(lng)}&format=json&accept-language=${
          pathname.split("/")[1]
        }`
      );
      const addressRes = await res.json();
      setAddressData({
        ...addressData,
        lat: lat,
        lng: lng,
        address: addressRes?.display_name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.updateAddressFromCoordinates = updateAddressFromCoordinates;
    return () => {
      delete window.updateAddressFromCoordinates;
    };
  }, [addressData]);

  const handleFoundLocation = () => {
    if (!navigator.geolocation) {
      toast.warning(addressT("geolocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation); // This will trigger MapController
        localStorage.setItem("yourLocation", JSON.stringify(newLocation));
        updateAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        toast.warning(addressT("geolocation"));
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = () => {
    const myAddresses = JSON.parse(localStorage.getItem("myAddresses") || "[]");
    if (!addressData.address) return toast.error("Please provide an address");
    if (!addressData.lat || !addressData.lng)
      return toast.error("Please select a location");

    const id = myAddresses.length + 1;
    const locale = pathname.split("/")[1] || "ru";

    let buildingLabel, entranceLabel, floorLabel, apartmentLabel, commentLabel;
    switch (locale) {
      case "ru":
        buildingLabel = "Дом";
        entranceLabel = "Подъезд";
        floorLabel = "Этаж";
        apartmentLabel = "Квартира";
        commentLabel = "Комментарий";
        break;
      case "uz":
        buildingLabel = "Uy";
        entranceLabel = "Kirish";
        floorLabel = "Qavat";
        apartmentLabel = "Xonadon";
        commentLabel = "Izoh";
        break;
      default:
        buildingLabel = "Building";
        entranceLabel = "Entrance";
        floorLabel = "Floor";
        apartmentLabel = "Apartment";
        commentLabel = "Comment";
        break;
    }

    let addressDetails = "";
    if (addressData.buildingNumber) {
      addressDetails += `${buildingLabel}: ${addressData.buildingNumber}. `;
    }
    if (addressData.entranceNumber) {
      addressDetails += `${entranceLabel}: ${addressData.entranceNumber}. `;
    }
    if (addressData.floorNumber) {
      addressDetails += `${floorLabel}: ${addressData.floorNumber}. `;
    }
    if (addressData.apartmentNumber) {
      addressDetails += `${apartmentLabel}: ${addressData.apartmentNumber}. `;
    }
    if (addressData.comment) {
      addressDetails += `${commentLabel}: ${addressData.comment}. `;
    }

    const newAddress = {
      id,
      address: addressData.address,
      lat: addressData.lat,
      lng: addressData.lng,
      comment: addressDetails,
    };

    myAddresses.push(newAddress);
    localStorage.setItem("myAddresses", JSON.stringify(myAddresses));
    toast.success("Address saved successfully");
    router.push(`${getUrl(pathname)}/cart`);
    setOrderData({
      ...orderData,
      address: addressData.address,
      client_addresses_id: id,
      lat: addressData.lat,
      lng: addressData.lng,
      address_comment: addressDetails,
    });
    setAddressData({
      id: 0,
      address: "",
      lat: null,
      lng: null,
      buildingNumber: "",
      entranceNumber: "",
      floorNumber: "",
      apartmentNumber: "",
      comment: "",
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("yourLocation")
      ? JSON.parse(localStorage.getItem("yourLocation"))
      : null;

    if (savedLocation) {
      setLocation(savedLocation);
      updateAddressFromCoordinates(savedLocation.lat, savedLocation.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          localStorage.setItem("yourLocation", JSON.stringify(newLocation));
          updateAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          toast.warning(addressT("geolocation"));
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
        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="address" className={"text-base leading-6"}>
            {addressT("address")}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] px-2 py-1 mt-2">
            <Textarea
              disabled={true}
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
          <div className="max-w-xl w-full grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="buildingNumber"
                className={"text-base leading-6 mt-3"}
              >
                {addressT("building_number") || "Building Number"}
              </Label>
              <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="buildingNumber"
                  name="buildingNumber"
                  type="text"
                  value={addressData.buildingNumber}
                  onChange={handleChangeInput}
                  placeholder={
                    addressT("building_number_pls") || "Enter building number"
                  }
                  className={
                    "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="entranceNumber"
                className={"text-base leading-6 mt-3"}
              >
                {addressT("entrance_number") || "Entrance Number"}
              </Label>
              <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="entranceNumber"
                  name="entranceNumber"
                  type="text"
                  value={addressData.entranceNumber}
                  onChange={handleChangeInput}
                  placeholder={
                    addressT("entrance_number_pls") || "Enter entrance number"
                  }
                  className={
                    "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="floorNumber"
                className={"text-base leading-6 mt-3"}
              >
                {addressT("floor_number") || "Floor Number"}
              </Label>
              <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="floorNumber"
                  name="floorNumber"
                  type="text"
                  value={addressData.floorNumber}
                  onChange={handleChangeInput}
                  placeholder={
                    addressT("floor_number_pls") || "Enter floor number"
                  }
                  className={
                    "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
            <div>
              <Label
                htmlFor="apartmentNumber"
                className={"text-base leading-6 mt-3"}
              >
                {addressT("apartment_number") || "Apartment Number"}
              </Label>
              <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="apartmentNumber"
                  name="apartmentNumber"
                  type="text"
                  value={addressData.apartmentNumber}
                  onChange={handleChangeInput}
                  placeholder={
                    addressT("apartment_number_pls") || "Enter apartment number"
                  }
                  className={
                    "w-full focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                  }
                />
              </div>
            </div>
          </div>
          <Label htmlFor="comment" className={"text-base leading-6 mt-3"}>
            {addressT("comment") || "Comment"}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 py-1">
            <Textarea
              id="comment"
              type="text"
              value={addressData.comment}
              onChange={handleChangeInput}
              name="comment"
              placeholder={
                addressT("comment_pls") || "Add delivery instructions"
              }
              className={
                "text-base focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
              }
            />
          </div>
          <div className="w-full hidden lg:grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-2 mt-5">
            <Button
              aria-label={`edit add`}
              onClick={handleSubmit}
              className={"w-full hover:bg-primary h-10 rounded-sm"}
            >
              {allT("add")}
            </Button>
          </div>
        </div>
        <div className="lg:w-full h-48 lg:h-80 rounded-xl overflow-hidden relative z-0">
          <div className="md:hidden absolute top-0 left-0 w-full h-full z-30 backdrop-blur-[1px] bg-black/10 flex justify-center items-center">
            <Dialog onOpenChange={setOpen} open={open} className="">
              <DialogTrigger asChild>
                <Button aria-label={`edit map`}>
                  {addressT("select_map")}
                </Button>
              </DialogTrigger>
              <DialogContent
                classnameOverlay="max-md:p-0 rounded-none pt-0"
                mark="false"
                className="sm:rounded-none h-screen w-screen p-0"
              >
                <DialogHeader className={""}>
                  <DialogTitle className="text-start pl-10 pt-0 pb-4">
                    {addressT("select_map")}
                  </DialogTitle>
                  <DialogDescription className="hidden">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                  <div className="w-full h-full relative">
                    <MapContainer
                      center={
                        location?.lat && location?.lng
                          ? [location.lat, location.lng]
                          : [41.2995, 69.2401]
                      }
                      zoom={17}
                      scrollWheelZoom
                      style={{ height: "100%", width: "100%", zIndex: 10 }}
                      whenCreated={(map) => (mapRef.current = map)} // Store map instance
                    >
                      <TileLayer
                        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <CenterMarker />
                      <MapController location={location} />
                    </MapContainer>
                    <Button
                      aria-label={`edit navigation`}
                      onClick={handleFoundLocation}
                      className={
                        "flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white h-12 w-12 absolute top-[50%] rounded-full right-4 z-50"
                      }
                    >
                      <Navigation size={32} />
                    </Button>
                    <Button
                      aria-label={`edit navigation`}
                      onClick={() => setOpen(false)}
                      className={
                        "p-0 flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white h-12 w-12 absolute top-[60%] rounded-full right-4 z-50"
                      }
                    >
                      <Plus size={32} />
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <MapContainer
            center={
              location?.lat && location?.lng
                ? [location.lat, location.lng]
                : [41.2995, 69.2401]
            }
            zoom={17}
            scrollWheelZoom
            style={{ height: "100%", width: "100%", zIndex: 10 }}
            whenCreated={(map) => (mapRef.current = map)} // Store map instance
          >
            <TileLayer
              attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CenterMarker />
            <MapController location={location} />
          </MapContainer>
          <Button
            aria-label={`edit navigation`}
            onClick={handleFoundLocation}
            className={
              "max-md:hidden flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white px-3 py-2 h-10 absolute bottom-3 left-3 z-50"
            }
          >
            <Navigation size={16} />
          </Button>
        </div>
      </div>
      <div className="lg:hidden w-full flex justify-between">
        <Button
          aria-label={`edit add2`}
          onClick={handleSubmit}
          className={"w-full hover:bg-primary h-12 rounded-md"}
        >
          {allT("add")}
        </Button>
      </div>
    </Container>
  );
};

export default EditAddress;
