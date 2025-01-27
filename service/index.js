import { url } from "../lib/utils.js";

const getData = async (endpoint) => {
  const res = await fetch(`${url}${endpoint}`, {
    cache: "no-store",
    // next: { revalidate: 60 }, // Revalidate every 1 minute (60 seconds)
  });
  const data = await res.json();
  return data;
};

export { getData };
