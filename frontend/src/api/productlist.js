import { publicApi } from "./axiospublic"; // or `api` if you're using single instance

export const fetchAllProducts = async () => {
  const res = await publicApi.get("/prod/products/all/");
  return res.data;
};
