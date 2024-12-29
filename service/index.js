import { url } from "@/lib/utils";

const getData = async (endpoint) => {
  const res = await fetch(`${url}${endpoint}`);
  const data = await res.json();
  return data;
};

export { getData };
