import { url } from "../lib/utils.js";

const getData = async (endpoint, revalidateTime = 0) => {
  const res = await fetch(`${url}${endpoint}`, {
    cache: "no-cache",
    // next: { revalidate: 0 }, // Revalidate every 1 minute (60 seconds)
  });
  const data = await res.json();
  return data;
};

export { getData };
