"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { translateTextSpotAddress } from "@/lib/utils";

// Helper component to smoothly transition the map's center
const SmoothTransition = ({ lng, lat, zoom = 14 }) => {
    const map = useMap();
    // Move map center with animation
    map.flyTo([lat, lng], zoom, { duration: 1.5 });
    return null;
};

const MapContact = ({ lng, lat, address, spotData, locale }) => {
    const addressMarker = new Icon({
        iconUrl:
            "https://rolling-omega.vercel.app/_next/image?url=%2Ficons%2F1.png&w=96&q=75",
        iconSize: [50, 70],
    });

    return (
        <div className="w-[100%] h-full max-h-[350px] z-10">
            <MapContainer
                center={[lat, lng]} // Initial center
                zoom={14}
                style={{ width: "100%", height: "100%", zIndex: "10" }}
                zoomControl={false}
            >
                {/* Smoothly transition the map's center when lng/lat changes */}
                <SmoothTransition lng={lng} lat={lat} zoom={14} />

                <TileLayer
                    attribution='&copy; <a href="https://www.jawg.io/">Jawg Maps</a> contributors'
                    url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=w5ttrDDjaPRXHLnelq9tbZ9j4foxqWTmHwXfqQ5WQcbmgJWV2vqR1U6FMj8Zm4j9"
                />

                {/* Render markers for all spots */}
                {spotData.map((spot, i) => (
                    <Marker
                        key={i}
                        position={[spot?.lat, spot?.lng]}
                        icon={addressMarker}
                    >
                        <Popup>
                            <h3 className="relative z-[999]">{translateTextSpotAddress(spot?.address, locale)}</h3>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapContact;
