import axios from "axios";

import { BASE_URL } from "@/utils/constant";

export const axiosApiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
