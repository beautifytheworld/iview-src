import Cookies from "js-cookie";

export const TOKEN_KEY = "token";

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 });
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};
export const setKey = (key, value) => {
  Cookies.set(key, value, { expires: 1 });
};
export const getKey = key => {
  const value = Cookies.get(key);
  return value;
};

export function clearAllCache() {
  for (const key in Cookies.get()) {
    Cookies.remove(key);
  }
}
