"use client";
import { Button } from "@/components/ui/button";
import { aboutLogo, appStoreIcon, facebook, instagram, playMarketIcon, telegram } from "@/public";
import { Mail, MapPin, PhoneCallIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { translateTextSpot, translateTextSpotAddress } from "@/lib/utils";
import dynamic from "next/dynamic";
import { icon } from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const ClientContact = ({ spotData, locale }) => {
    const contactT = useTranslations("Contact")
    const [address, setAddress] = useState(null);
    const addressMarker = new icon({
        iconUrl:
            "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/locaation.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL2xvY2FhdGlvbi5wbmciLCJpYXQiOjE3MzczNzk0NTksImV4cCI6MTc2ODkxNTQ1OX0.gSnye5QeEB43lsmQBXxbXTVasrR4JFKoGCcWCeIYhhg&t=2025-01-20T13%3A24%3A20.162Z",
        iconSize: [40, 40],
    });
    const userMarker = new icon({
        iconUrl:
            "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
        iconSize: [60, 60],
    });
    const branchMarker = new icon({
        iconUrl:
            "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/branch.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL2JyYW5jaC5wbmciLCJpYXQiOjE3MzczNzk3MzQsImV4cCI6MTc2ODkxNTczNH0.Pmqf4d58IB_zDVfbyhpu9J-jmfhxa-_r7REEJhL92BQ&t=2025-01-20T13%3A28%3A55.611Z",
        iconSize: [40, 40],
    });
    useEffect(() => {
        if (spotData && spotData.length > 0) {
            const firstItemWithImage = {
                ...spotData[0],
                image: '/assets/yakkasaroy.jpg',
            };

            setAddress(firstItemWithImage);
        }
    }, []);

    function addPhoto(params) {
        const images = {
            1: '/assets/yakkasaroy.jpg',
            2: '/assets/olmazor.jpg',
            3: '/assets/ulugbek.jpg',
        };

        if (images[params.spot_id]) {
            setAddress({ ...params, image: images[params.spot_id] });
        }
    }
    return (
        <div className="flex flex-col mt-5 w-full">
            <h1 className="text-xl md:text-2xl font-semibold text-start w-full text-[#004032]">
                {contactT("title")}
            </h1>
            <div className="flex justify-center py-8 lg:hidden">
                <Image
                    src={aboutLogo}
                    alt={`aboutlogo`}
                    // fill={true}
                    className=" w-[400px] aspect-[4/1]"
                />
            </div>
            <div className="w-full flex flex-col lg:flex-row mt-7">
                <div className="lg:w-1/3 flex flex-col ">
                    <h3 className="lg:text-lg font-semibold">{contactT("txtContact")}</h3>

                    {/* <article className="flex flex-col gap-6 mt-7">
                        <p className="flex gap-6 text-[#004032]">
                            <PhoneCallIcon size={24} color="#004032" /> +998 (77) 079 24 24
                        </p>
                        <p className="flex gap-6 text-[#004032]">
                            <PhoneCallIcon size={24} color="#004032" /> +998 (77) 120 24 24
                        </p>
                        <p className="flex gap-6 text-[#004032]">
                            <PhoneCallIcon size={24} color="#004032" /> +998 (77) 121 24 24
                        </p>
                    </article> */}

                    <article className="flex flex-col gap-6 mt-3">
                        <p className="flex gap-6 text-[#004032]">
                            <Mail size={24} color="#004032" />rollingsushi@gmail.com
                        </p>
                        {spotData.map((item) => (
                            <button
                                key={item.spot_id}
                                onClick={() => addPhoto(item)}
                                className="flex gap-6"
                            >
                                <p className={`text-[#004032] text-start underline-offset-8 py-3 px-5 rounded-xl border-2 border-[#004032] ${address?.spot_id == item.spot_id ? "bg-primary text-white" : ""}`}>{translateTextSpot(item.name, locale)}</p>
                            </button>
                        ))}
                    </article>
                </div>
                <div className="lg:w-1/3 flex flex-col items-center mx-5 rounded-3xl mt-5 lg:mt-0">
                    {/* <Image src={address?.image || "/assets/yakkasaroy.jpg"} width={500} height={100} alt={address?.name} className="h-40 w-full object-contain " /> */}
                    <p className=" text-base font-semibold text-[#004032] text-start w-full">{translateTextSpotAddress(address?.address, locale)}</p>
                    <a href={address?.spot_id === 1
                        ? "tel:+998771212424"
                        : address?.spot_id === 2
                            ? "tel:+998771202424"
                            : "tel:+998770792424" // Default qiymat (agar spot_id 1 yoki 2 bo'lmasa)
                    } className="flex text-base gap-6 text-[#004032] pt-3 text-start w-full">
                        <PhoneCallIcon size={24} color="#004032" /> {address?.spot_id === 1
                            ? "+998 (77) 121 24 24"
                            : address?.spot_id === 2
                                ? "+998 (77) 120 24 24"
                                : "+998 (77) 079 24 24" // Default qiymat (agar spot_id 1 yoki 2 bo'lmasa)
                        }
                    </a>
                    <div className="w-full h-40 my-4 ">
                        <MapContainer
                            center={[address?.lat, address?.lng]}
                            zoom={11}
                            style={{ width: "100%", height: "100%", zIndex: "10" }}

                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.jawg.io/">Jawg Maps</a> contributors'
                                url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=w5ttrDDjaPRXHLnelq9tbZ9j4foxqWTmHwXfqQ5WQcbmgJWV2vqR1U6FMj8Zm4j9"
                            />
                            <Marker
                                position={[address?.lat, address?.lng]}
                                icon={1 === 1 ? addressMarker : branchMarker}
                            >
                                <Popup>
                                    <h3>Yakkasaroy</h3>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <Button className={"w-full max-w-96 h-11 hover:bg-primary"}>{contactT("btnShare")}</Button>
                </div>
                <div className="lg:w-1/3 flex flex-col mt-5 lg:m-0">
                    <div className="hidden lg:flex justify-center pb-6">
                        <Image
                            src={aboutLogo}
                            alt={`aboutlogo`}
                            // fill={true}
                            className=" w-[400px] aspect-[4/1]"
                        />
                    </div>
                    <h3 className="lg:text-lg font-semibold text-center">{contactT("txtSocial")}</h3>
                    <div className="w-full flex justify-center gap-5 my-4">
                        <Link href="https://m.facebook.com/share/AWGgNk6838gCPzwP/?mibextid=LQQJ4d&wtsid=rdr_0qCKhsGI6L2hLeto3" target="_blank" rel="noopener noreferrer"><Image src={facebook} alt="facebook" /></Link>
                        <Link href="https://t.me/rollingsushi_uz" target="_blank" rel="noopener noreferrer"><Image src={telegram} alt="telegram" /></Link>
                        <Link href="https://www.instagram.com/rollingsushiuz/" target="_blank" rel="noopener noreferrer"><Image src={instagram} alt="instagram" /></Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientContact;
