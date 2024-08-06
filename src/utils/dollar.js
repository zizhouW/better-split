export const dollar = (num, abs = true) => {
  const absNum = abs ? Math.abs(num) : num;
  return `$${absNum.toFixed(2)}`;
};

const reg = /^[0-9]+(\.[0-9][0-9]?)?$/
export const isValidDollarAmount = (num) => {
  return reg.test(num);
};
