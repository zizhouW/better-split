let currentUser = null;

export const setCurrentUser = (userInfo) => {
  currentUser = userInfo;
};

export const getCurrentUser = () => {
  return currentUser;
};
