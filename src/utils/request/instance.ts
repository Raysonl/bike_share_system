import axios from "axios";
import { configs } from "configs";
import camelcaseKeys from "camelcase-keys";
const instance = axios.create({
  baseURL: configs.API_URL,
});

instance.interceptors.response.use((response) => {
  const data = response.data;
  return {
    ...response,
    data:
      data && data !== null && typeof data === "object"
        ? camelcaseKeys(data, { deep: true })
        : data,
  };
});

export { instance as httpInstance };
