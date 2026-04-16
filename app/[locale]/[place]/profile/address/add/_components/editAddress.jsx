"use client";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import Container from "@/components/shared/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";
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
import { useSearchParams } from 'next/navigation'

/* ======================= Helpers (texts by locale) ======================= */
function useLocaleTexts(pathname) {
  const locale = (pathname?.split("/")[1] || "ru").toLowerCase();

  const texts = {
    ru: {
      selectOnMap: "Выбрать на карте",
      tapHint: "Нажмите, чтобы выбрать локацию на карте",
      choose: "Выбрать",
      geoWarn: "Геолокация недоступна",
      add: "Добавить",
      buildingPH: "Введите номер дома",
      entrancePH: "Введите номер подъезда",
      floorPH: "Введите этаж",
      apartmentPH: "Введите номер квартиры",
      commentPH: "Добавьте комментарий курьеру",
      dialogTitle: "Выберите локацию на карте",
      dialogHint: "Переместите карту так, чтобы маркер оказался в нужной точке, затем нажмите «Выбрать».",
    },
    uz: {
      selectOnMap: "Xaritadan tanlash",
      tapHint: "Xaritadan joy tanlash uchun bosing",
      choose: "Tanlash",
      geoWarn: "Geolokatsiya mavjud emas",
      add: "Qo'shish",
      buildingPH: "Uy raqamini kiriting",
      entrancePH: "Kirish raqamini kiriting",
      floorPH: "Qavatni kiriting",
      apartmentPH: "Xonadon raqamini kiriting",
      commentPH: "Kuryer uchun izoh qoldiring",
      dialogTitle: "Xaritadan joyni tanlang",
      dialogHint: "Xaritani kerakli joyga suring, markerni markazga keltiring va «Tanlash» tugmasini bosing.",
    },
    en: {
      selectOnMap: "Select on map",
      tapHint: "Tap to choose location on the map",
      choose: "Select",
      geoWarn: "Geolocation is unavailable",
      add: "Add",
      buildingPH: "Enter building number",
      entrancePH: "Enter entrance number",
      floorPH: "Enter floor",
      apartmentPH: "Enter apartment number",
      commentPH: "Add delivery comment for courier",
      dialogTitle: "Choose a location on the map",
      dialogHint: "Move the map so the marker sits on your spot, then press \u201CSelect\u201D.",
    },
  };

  if (locale === "ru" || locale === "uz") return { locale, ...texts[locale] };
  return { locale: "en", ...texts.en };
}

/* ======================= Map components ======================= */

// Center Marker that stays fixed in the middle; triggers address updates on moveend
const CenterMarker = ({ searchParams }) => {
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
            width: "50px",
            height: "70px",
            backgroundImage: 'url("/icons/1.png")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
      </div>
    </>
  );
};

// Imperative controller to recenter when `location` changes
const MapController = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.setView([location.lat, location.lng], 18);
    }
  }, [location]);
  return null;
};

/* ======================= Main Component ======================= */

const EditAddress = () => {
  const [open, setOpen] = useState(false);
  const { orderData, setOrderData } = useOrderStore();
  const mapRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams()

  const addressT = useTranslations("Profile.Address");
  const allT = useTranslations("All");

  const {
    locale,
    selectOnMap,
    tapHint,
    choose,
    geoWarn,
    add,
    buildingPH,
    entrancePH,
    floorPH,
    apartmentPH,
    commentPH,
    dialogTitle,
    dialogHint,
  } = useLocaleTexts(pathname);

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

  const [location, setLocation] = useState({ lat: null, lng: null });

  // Reverse geocode and update addressData
  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${String(
          lat
        )}&lon=${String(lng)}&format=json&accept-language=${locale}`
      );
      const addressRes = await res.json();
      setAddressData((prev) => ({
        ...prev,
        lat,
        lng,
        address: addressRes?.display_name || prev.address,
      }));
    } catch (error) {
      toast.warning(addressT("geolocation") || geoWarn);
    }
  };

  // Expose updater globally for CenterMarker
  useEffect(() => {
    window.updateAddressFromCoordinates = updateAddressFromCoordinates;
    return () => {
      delete window.updateAddressFromCoordinates;
    };
  }, [locale]);

  // Geolocation → center map
  const handleFoundLocation = () => {
    if (!navigator.geolocation) {
      toast.warning(addressT("geolocation") || geoWarn);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setLocation(newLocation);
        localStorage.setItem("yourLocation", JSON.stringify(newLocation));
        updateAddressFromCoordinates(latitude, longitude);
      },
      (error) => {
        toast.warning(addressT("geolocation") || geoWarn);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Confirm current map center as selected location (for dialog)
  const handleConfirmLocation = () => {
    try {
      const center = mapRef.current?.getCenter?.();
      if (center) {
        const lat = center.lat;
        const lng = center.lng;
        setLocation({ lat, lng });
        localStorage.setItem("yourLocation", JSON.stringify({ lat, lng }));
        updateAddressFromCoordinates(lat, lng);
      }
    } finally {
      setOpen(false);
    }
  };

  const handleSubmit = () => {
    const myAddresses = JSON.parse(localStorage.getItem("myAddresses") || "[]");
    if (!addressData.address) return toast.error("Please provide an address");
    if (!addressData.lat || !addressData.lng)
      return toast.error("Please select a location");

    const id = myAddresses.length + 1;

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

    // Update order store and redirect

    const redirect = searchParams.get('redirect')
    const url = `${getUrl(pathname)}/${redirect ? redirect : 'profile/address'}`;

    router.push(url);
    setOrderData({
      ...orderData,
      address: addressData.address,
      client_addresses_id: id,
      lat: addressData.lat,
      lng: addressData.lng,
      address_comment: addressDetails,
    });

    // Reset form
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

  // Initial location: use saved location or geolocate
  useEffect(() => {
    const saved = localStorage.getItem("yourLocation");
    const savedLocation = saved ? JSON.parse(saved) : null;

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
        () => {
          toast.warning(addressT("geolocation") || geoWarn);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  return (
    <Container className="w-11/12 flex flex-col pt-3 md:pt-8">
      <h1 className="font-semibold textNormal4 text-primary w-full text-start">
        {addressT("title")}
      </h1>

      <div className="w-full flex flex-col lg:flex-row my-6 justify-around gap-5 md:gap-16">
        {/* ======================= Left form ======================= */}
        <div className="w-full flex flex-col gap-2">
          {/* Address (read-only) — opens map on click */}
          <Label htmlFor="address" className="text-base leading-6">
            {addressT("address")}
          </Label>

          <div
            className="max-w-xl w-full bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 py-1 cursor-pointer"
          >
            <Textarea
              id="address"
              name="address"
              value={addressData.address}
              onChange={handleChangeInput}
              placeholder={tapHint}
              className="text-xs sm:text-base bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none cursor-pointer"
            />
          </div>

          {/* Hint under the address field */}
          <p className="text-xs sm:text-base text-muted-foreground mt-1">{tapHint}</p>

          {/* "Select on map" button placed under the address (Variant 1) */}
          <div className="md:hidden mt-2">
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="h-10 rounded-sm"
              aria-label="open map dialog"
            >
              {selectOnMap}
            </Button>
          </div>

          {/* Address details */}
          <div className="max-w-xl w-full grid grid-cols-2 gap-3 mt-4">
            <div>
              <Label htmlFor="buildingNumber" className="text-base leading-6">
                {addressT("building_number") || "Building Number"}
              </Label>
              <div className="w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="buildingNumber"
                  name="buildingNumber"
                  type="text"
                  value={addressData.buildingNumber}
                  onChange={handleChangeInput}
                  placeholder={buildingPH}
                  className="text-xs sm:text-base w-full bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="entranceNumber" className="text-base leading-6">
                {addressT("entrance_number") || "Entrance Number"}
              </Label>
              <div className="w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="entranceNumber"
                  name="entranceNumber"
                  type="text"
                  value={addressData.entranceNumber}
                  onChange={handleChangeInput}
                  placeholder={entrancePH}
                  className="text-xs sm:text-base w-full bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="floorNumber" className="text-base leading-6">
                {addressT("floor_number") || "Floor Number"}
              </Label>
              <div className="w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="floorNumber"
                  name="floorNumber"
                  type="text"
                  value={addressData.floorNumber}
                  onChange={handleChangeInput}
                  placeholder={floorPH}
                  className="text-xs sm:text-base w-full bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="apartmentNumber" className="text-base leading-6">
                {addressT("apartment_number") || "Apartment Number"}
              </Label>
              <div className="w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 h-12">
                <Input
                  id="apartmentNumber"
                  name="apartmentNumber"
                  type="text"
                  value={addressData.apartmentNumber}
                  onChange={handleChangeInput}
                  placeholder={apartmentPH}
                  className="text-xs sm:text-base w-full bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
                />
              </div>
            </div>
          </div>

          <Label htmlFor="comment" className="text-base leading-6 mt-3">
            {addressT("comment") || "Comment"}
          </Label>
          <div className="max-w-xl w-full flex items-center bg-[#F5F5F5] border-[0.5px] border-[#B9B9BB] rounded-[10px] mt-2 px-2 py-1">
            <Textarea
              id="comment"
              value={addressData.comment}
              onChange={handleChangeInput}
              name="comment"
              placeholder={commentPH}
              className="text-xs sm:text-base bg-transparent focus-visible:outline-none focus-visible:ring-0 border-none shadow-none"
            />
          </div>

          {/* Desktop "Add" button */}
          <div className="w-full hidden lg:grid grid-cols-1 gap-y-4 lg:grid-cols-3 gap-x-2 mt-5">
            <Button
              aria-label="submit address"
              onClick={handleSubmit}
              className="w-full hover:bg-primary h-10 rounded-sm"
            >
              {allT("add") || add}
            </Button>
          </div>
        </div>

        {/* ======================= Right Map (desktop) ======================= */}
        <div className="max-md:hidden lg:w-full h-48 lg:h-80 rounded-xl overflow-hidden relative z-0">
          {/* Mobile overlay that forces using dialog */}
          <div className="md:hidden absolute top-0 left-0 w-full h-full z-30 backdrop-blur-[1px] bg-black/10 flex justify-center items-center">
            <Dialog onOpenChange={setOpen} open={open}>
              <DialogTrigger className="hidden" asChild>
                <Button aria-label="open map dialog">{selectOnMap}</Button>
              </DialogTrigger>
              <DialogContent
                classnameOverlay="max-md:p-0 rounded-none pt-0"
                mark="false"
                className="sm:rounded-none h-screen w-screen p-0"
              >
                <DialogHeader>
                  <DialogTitle className="hidden text-start pl-10 pt-0 pb-2">
                    {dialogTitle}
                  </DialogTitle>
                  <DialogDescription className="px-10 pb-2 text-sm text-muted-foreground">
                    {dialogHint}
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
                      whenCreated={(map) => (mapRef.current = map)}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <CenterMarker />
                      <MapController location={location} />
                    </MapContainer>

                    <div className="pb-10 pt-4 bg-white w-full fixed bottom-0 left-0 z-[999]">
                      {/* Confirm: Replace "+" with clear "Choose" */}
                      <div className=" flex flex-col items-center gap-5 w-11/12 mx-auto">
                        <div className="px-4 text-sm text-muted-foreground line-clamp-2">{addressData.address}</div>
                        <div className="w-full flex justify-between items-center gap-5 ">
                          <div className="w-full rounded-full">
                            <Button
                              onClick={handleConfirmLocation}
                              className="w-full h-12 text-base"
                            >
                              {choose}
                            </Button>
                          </div>
                          {/* Geolocate */}
                          <Button
                            aria-label="use my location"
                            onClick={handleFoundLocation}
                            className="flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white h-12 w-12 rounded-full z-50"
                          >
                            <Navigation size={32} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop map (always visible) */}
          <MapContainer
            center={
              location?.lat && location?.lng
                ? [location.lat, location.lng]
                : [41.2995, 69.2401]
            }
            zoom={17}
            scrollWheelZoom
            style={{ height: "100%", width: "100%", zIndex: 10 }}
            whenCreated={(map) => (mapRef.current = map)}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CenterMarker />
            <MapController location={location} />
          </MapContainer>

          {/* Geolocate (desktop) */}
          <Button
            aria-label="use my location desktop"
            onClick={handleFoundLocation}
            className="max-md:hidden flex bg-primary hover:bg-opacity-70 text-base gap-3 items-center text-white px-3 py-2 h-10 absolute bottom-3 left-3 z-50"
          >
            <Navigation size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile "Add" button */}
      <div className="lg:hidden w-full flex justify-between">
        <Button
          aria-label="submit address mobile"
          onClick={handleSubmit}
          className="w-full hover:bg-primary h-12 rounded-md"
        >
          {allT("add") || add}
        </Button>
      </div>
    </Container>
  );
};

export default EditAddress;
