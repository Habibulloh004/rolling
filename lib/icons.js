import { branchMarker } from "@/public/assets/markers";
import L from "leaflet";

// Create a custom icon using L.icon
const iconBranch = L.icon({
  iconUrl:
    "https://fkkpuaszmvpxjoqqmlzx.supabase.co/storage/v1/object/sign/rolling-sushi/user.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyb2xsaW5nLXN1c2hpL3VzZXIucG5nIiwiaWF0IjoxNzM3Mzc5NDQ2LCJleHAiOjE3Njg5MTU0NDZ9._ac5SnVZfXfhP78dd2wbfQsB-kAKvxlMQvI7GNQg-QI&t=2025-01-20T13%3A24%3A07.547Z",
  iconSize: [60, 75], // Width and height of the icon
  iconAnchor: [30, 75], // Anchor point of the icon (center bottom)
  popupAnchor: [0, -75], // Position of the popup relative to the icon
  className: "leaflet-div-icon", // Optional custom class
});

export { iconBranch };
