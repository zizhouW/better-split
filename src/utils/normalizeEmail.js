export const normalizeEmail = (email) => {
  return email?.replace(/\./g, '');
};
