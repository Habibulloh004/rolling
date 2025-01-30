import { url } from "../lib/utils.js";

const getData = async (endpoint, revalidateTime = 0) => {
  const res = await fetch(`${url}${endpoint}`, {
    cache: "force-cache",
    next: { revalidate: revalidateTime }, // Revalidate every 1 minute (60 seconds)
  });
  const data = await res.json();
  return data;
};

export { getData };
