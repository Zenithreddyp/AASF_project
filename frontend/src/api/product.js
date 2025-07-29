import { publicApi } from "./axiospublic"; 

export const fetchAllProducts = async () => {
  const res = await publicApi.get("/prod/products/all/");
  return res.data;
};


export const searchProduct = async (searchterm) => {
  const res = await publicApi.get(`/prod/products/search/?name=${searchterm}`)
  console.log(res.data);
  return res.data;
}

