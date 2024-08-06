// month starts with 1 (January)
export const getLastDayOfMonth = (year, month) => {
  if (!year || !month) return 0;

  const lastDate = new Date(year, month, 0);

  return lastDate.getDate();
};
