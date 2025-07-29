import { publicApi } from "./axiospublic"; 

export const fetchAllProducts = async () => {
  const res = await publicApi.get("/prod/products/all/");
  return res.data;
};


export const searchProduct = async (name) => {
  const res = await publicApi.get(`/prod/products/search/?name=${name}`)
  return res.data;
}

