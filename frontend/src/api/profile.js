import { privateApi } from "./axiosprivate";

export const fetchusername = async () => {
    const res = await privateApi.get("/users/user/username/");
    return res.data;
}

