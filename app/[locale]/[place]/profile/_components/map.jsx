"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ longitude: lng, latitude: lat, address }) => {
  const userMarker = new Icon({
    iconUrl:
      "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
    iconSize: [60, 60],
  });

  return (
    <>
      <div className="w-[100%] h-full max-h-[350px] z-10">
        <MapContainer
          center={[lat, lng]}
          zoom={11}
          style={{ width: "100%", height: "100%", zIndex: "10" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.jawg.io/">Jawg Maps</a> contributors'
            url="https://{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token=w5ttrDDjaPRXHLnelq9tbZ9j4foxqWTmHwXfqQ5WQcbmgJWV2vqR1U6FMj8Zm4j9"
          />
          <Marker position={[lat, lng]} icon={userMarker}>
            <Popup>
              <h3>{address}</h3>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
