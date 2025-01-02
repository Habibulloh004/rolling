import { posterToken, posterUrl } from "@/lib/utils";
import axios from "axios";

export const ApiService = {
  async getData(url, props) {
    const response = await axios.get(
      `${posterUrl}/api/${url}?${posterToken}${props ? props : ""}`
    );
    return response.data;
  },
  async get(url) {
    const response = await axios.get(`${NEXT_BASE_URL}${url}`);
    return response;
  },
};
