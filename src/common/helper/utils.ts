export const random = (lengthCode: number): string => {
  let number = [];
  for (let i = 0; i < lengthCode; i++) {
    number.push(Math.floor(Math.random() * (9 - 0)) + 0);
  }
  return number.join('');
};
