"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";

// Dynamically import MapContainer and its children to disable SSR
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const Map = ({ longitude: lng, latitude: lat }) => {
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

  return (
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
            <h3>Привет, я клиент.</h3>
          </Popup>
        </Marker>
        <Marker
          position={[41.267193, 69.226858]}
          icon={1 === 1 ? addressMarker : branchMarker}
        >
          <Popup>
            <h3>Yakkasaroy</h3>
          </Popup>
        </Marker>
        <Marker
          position={[41.350852, 69.24414]}
          icon={1 === 2 ? addressMarker : branchMarker}
        >
          <Popup>
            <h3>Olmazor</h3>
          </Popup>
        </Marker>
        <Marker
          position={[41.318682, 69.339927]}
          icon={3 === 3 ? addressMarker : branchMarker}
        >
          <Popup>
            <h3>Buyuk ipak yo'li</h3>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
