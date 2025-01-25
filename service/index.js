import { url } from "@/lib/utils";

const getData = async (endpoint) => {
  const res = await fetch(`${url}${endpoint}`, {
    cache: "force-cache",
    next: { revalidate: 60 }, // Revalidate every 1 minute (60 seconds)
  });
  const data = await res.json();
  return data;
};

export { getData };
