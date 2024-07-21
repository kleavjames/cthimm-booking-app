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

export const generateStringWithRandomNumbers = () => {
  // Generate 9 random numbers and join them into a string
  let randomNumbers = "";
  for (let i = 0; i < 9; i++) {
    randomNumbers += Math.floor(Math.random() * 10).toString();
  }

  // Return the combined string
  return "DELUXE" + randomNumbers;
};

export const generateReferenceNumber = () => {
  // Generate a random character (assuming lowercase letters for simplicity)
  const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);

  // Generate 9 random numbers and join them into a string
  let randomNumbers = "";
  for (let i = 0; i < 9; i++) {
    randomNumbers += Math.floor(Math.random() * 10).toString();
  }

  // Return the combined string
  return randomChar.toUpperCase() + randomNumbers;
};
