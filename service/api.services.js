import { posterToken, posterUrl } from "../lib/utils.js";
import axios from "axios";

export const ApiService = {
  async getPosterData(url, props) {
    const response = await axios.get(
      `${posterUrl}/api/${url}?token=${posterToken}${props ? props : ""}`
    );
    return response.data;
  },
  async get(url) {
    const response = await axios.get(`${NEXT_BASE_URL}${url}`);
    return response;
  },
};
