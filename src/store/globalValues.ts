import Cookies from "js-cookie";

export const baseURL: string = import.meta.env.VITE_API_URL;

export function getJwtToken() {
    let cookie: any = Cookies.get("jwtToken");

    return cookie;
}
