const TOKEN = 'bs:token';

export const getToken = () => {
  return window.localStorage.getItem(TOKEN);
};

export const setToken = (token) => {
  window.localStorage.setItem(TOKEN, token);
};

export const removeToken = () => {
  window.localStorage.removeItem(TOKEN);
};
