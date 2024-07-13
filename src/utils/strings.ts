export const splitStringAndNumbers = (input: string) => {
  // Regular expressions to match sequences of letters and numbers
  const letters = input.match(/[a-zA-Z]+/g) || [];
  const numbers = input.match(/\d+/g) || [];

  // Convert the numbers from strings to integers
  const numbersAsIntegers = numbers.map(Number);

  return { letters, numbers: numbersAsIntegers };
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
