import { configs } from "configs";
import Cookies from "js-cookie";
import { IncomingHttpHeaders } from "http";

const { TOKEN_KEY: TokenKey } = configs;

const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export const getCookieFromHeader = (
  cookie: IncomingHttpHeaders["cookie"],
  name: string
) => {
  if (!cookie) return undefined;
  const parsed = parseCookie(cookie);
  return parsed[name] ?? null;
};

export async function getToken(): Promise<string | null> {
  return Cookies.get(TokenKey) ? (Cookies.get(TokenKey) as string) : null;
}

export async function setToken(token: string, expires?: number | Date) {
  if (!token) {
    return;
  }

  return Cookies.set(TokenKey, token, { expires });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export const getTokenFromHeader = (str: string) => {
  return getCookieFromHeader(str, TokenKey);
};
