let usersCache = [];

export const setUsers = (users) => {
  usersCache = users;
};

export const getUsers = () => {
  return usersCache;
};
