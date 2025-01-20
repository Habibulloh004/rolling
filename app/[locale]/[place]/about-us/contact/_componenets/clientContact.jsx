"use client";
import { Button } from "@/components/ui/button";
import { aboutLogo, appStoreIcon, facebook, instagram, playMarketIcon, telegram } from "@/public";
import { Mail, MapPin, PhoneCallIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { translateTextSpot, translateTextSpotAddress } from "@/lib/utils";

const ClientContact = ({ spotData, locale }) => {
    const contactT = useTranslations("Contact")
    const [address, setAddress] = useState(null);
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
                        <YMaps query={{ apikey: "0cce4c39-8879-4e3c-b343-288c3e6adcd0" }}>
                            <Map
                                defaultState={{
                                    center: [Number(address?.lat), Number(address?.lng)],
                                    zoom: 17,
                                }}
                                width="100%"
                                height="100%"
                            >
                                <Placemark geometry={[Number(address?.lat), Number(address?.lng)]} />
                            </Map>
                        </YMaps>
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
