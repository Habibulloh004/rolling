"use client";
import { Button } from "@/components/ui/button";
import { Mail, PhoneCallIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { translateTextSpot, translateTextSpotAddress } from "@/lib/utils";
import MapContact from "./map-contact";
import { toast } from "sonner"
import { AlertDialog } from "@/components/ui/alert-dialog";

const ClientContact = ({ spotData, locale }) => {
  const contactT = useTranslations("Contact");
  const [address, setAddress] = useState(null);

  // Predefined markers
  const images = {
    1: "/assets/yakkasaroy.jpg",
    2: "/assets/olmazor.jpg",
    3: "/assets/ulugbek.jpg",
  };

  // Default image for address
  useEffect(() => {
    if (spotData && spotData.length > 0) {
      const firstItemWithImage = {
        ...spotData[0],
        image: images[spotData[0].spot_id] || images[1], // Default image
        lat: spotData[0].lat || 41.2995, // Default latitude (Tashkent example)
        lng: spotData[0].lng || 69.2401, // Default longitude
      };
      setAddress(firstItemWithImage);
    }
  }, [spotData]);

  // Update address with image when a spot is selected
  function addPhoto(spot) {
    setAddress({
      ...spot,
      image: images[spot.spot_id] || images[1], // Default image
      lat: spot.lat || 41.2995, // Default latitude
      lng: spot.lng || 69.2401, // Default longitude
    });
  }
  const handleShare = (lng, lat) => {
    const url = `https://yandex.com/maps/?pt=${lng},${lat}&z=16&l=map`;

    // Dinamik input maydon yaratish
    const input = document.createElement("input");
    input.value = url; // URL-ni inputga o'rnatish
    document.body.appendChild(input); // Hujjatga qo'shish
    input.select(); // Matnni tanlash
    input.setSelectionRange(0, 99999); // Ba'zi qurilmalar uchun tanlov

    try {
      document.execCommand("copy");
      toast("Yandex Links", {
        description: "Copy clipboard",
        action: {
          label: "Undo",
        },
      })
    } catch (err) {
     console.log(err);
    }

    document.body.removeChild(input); // Inputni olib tashlash
  };



  // Fallback for missing data
  if (!spotData || spotData.length === 0) {
    return <p>{contactT("noDataAvailable")}</p>;
  }

  return (
    <div className="flex flex-col mt-5 w-full">
      <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032]">
        {contactT("title")}
      </h1>

      <div className="flex justify-center py-8 lg:hidden">
        <Image
          src={`/assets/aboutLogo.svg`}
          alt="about logo"
          width={500}
          height={100}
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row mt-7">
        {/* Contact Information Section */}
        <div className="lg:w-1/3 flex flex-col">
          <h3 className="lg:text-lg font-semibold">{contactT("txtContact")}</h3>
          <article className="flex flex-col gap-6 mt-3">
            <p className="flex gap-6 text-[#004032]">
              <Mail size={24} color="#004032" />
              rollingsushi@gmail.com
            </p>
            {spotData.map((spot) => (
              <button
                key={spot.spot_id}
                onClick={() => addPhoto(spot)}
                className={`flex gap-6 text-start underline-offset-8 py-3 px-5 rounded-xl border-2 border-[#004032] ${address?.spot_id === spot.spot_id
                    ? "bg-primary text-white"
                    : ""
                  }`}
              >
                {translateTextSpot(spot.name, locale)}
              </button>
            ))}
          </article>
        </div>

        {/* Address and Map Section */}
        <div className="lg:w-1/3 flex flex-col items-center mx-5 rounded-3xl mt-5 lg:mt-0">
          {/* <Image
                        src={address?.image || "/assets/yakkasaroy.jpg"}
                        alt={address?.name || "default address"}
                        width={500}
                        height={300}
                        className="h-40 w-full object-contain"
                    /> */}
          <p className="text-base font-semibold text-[#004032] text-start w-full mt-4">
            {translateTextSpotAddress(address?.address, locale)}
          </p>
          <a
            href={`tel:${address?.spot_id === 1
                ? "+998771212424"
                : address?.spot_id === 2
                  ? "+998771202424"
                  : "+998770792424"
              }`}
            className="flex text-base gap-6 text-[#004032] pt-3 text-start w-full"
          >
            <PhoneCallIcon size={24} color="#004032" />
            {address?.spot_id === 1
              ? "+998 (77) 121 24 24"
              : address?.spot_id === 2
                ? "+998 (77) 120 24 24"
                : "+998 (77) 079 24 24"}
          </a>
          <div className="w-full h-40 my-4">
            {address?.lat && address?.lng ? (
              <MapContact
                spotData={spotData}
                lng={Number(address.lng)}
                lat={Number(address.lat)}
                address={translateTextSpotAddress(address?.address, locale)}
                locale={locale}
              />
            ) : (
              <p className="text-center text-gray-500">none</p>
            )}
          </div>
          <Button
            className="w-full max-w-96 h-11 hover:bg-primary"
            onClick={() =>  handleShare(Number(address.lng), Number(address.lat))}
          >
            {contactT("btnShare")}
          </Button>
        </div>

        {/* Social Links Section */}
        <div className="lg:w-1/3 flex flex-col mt-5 lg:mt-0">
          <div className="hidden lg:flex justify-center pb-6">
            <Image
              src={`/assets/aboutLogo.svg`}
              alt="about logo"
              width={500}
              height={100}
            />
          </div>
          <h3 className="lg:text-lg font-semibold text-center">
            {contactT("txtSocial")}
          </h3>
          <div className="w-full flex justify-center gap-5 my-4">
            <Link
              href="https://m.facebook.com/share/AWGgNk6838gCPzwP/?mibextid=LQQJ4d&wtsid=rdr_0qCKhsGI6L2hLeto3"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={40}
                height={40}
                src={`/assets/facebook.svg`}
                alt="facebook"
              />
            </Link>
            <Link
              href="https://t.me/rollingsushi_uz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={40}
                height={40}
                src={`/assets/telegram.svg`}
                alt="telegram"
              />
            </Link>
            <Link
              href="https://www.instagram.com/rollingsushiuz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={40}
                height={40}
                src={`/assets/instagram.svg`}
                alt="instagram"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientContact;
