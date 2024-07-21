export const seatNumbers = [
  [1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
  [39, 40, 41, 42],
];

export const rows = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "AA",
  "AB",
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
  "AH",
  "AI",
  "AJ",
];

export const notIncluded = [
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "A11",
  "A12",
  "A13",
  "A14",
  "A15",
  "A16",
  "A17",
  "A18",
  "A19",
  "A20",
  "A21",
  "A22",
  "A23",
  "A24",
  "A25",
  "A26",
  "A27",
  "A28",
  "A29",
  "A30",
  "A31",
  "A32",
  "A33",
  "A34",
  "A35",
  "A36",
  "A37",
  "A38",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "B11",
  "B12",
  "B13",
  "B14",
  "B15",
  "B16",
  "B17",
  "B18",
  "B19",
  "B20",
  "B21",
  "B22",
  "B23",
  "B24",
  "B25",
  "B26",
  "B27",
  "B28",
  "B29",
  "B30",
  "B31",
  "B32",
  "B33",
  "B34",
  "B35",
  "B36",
  "B37",
  "B38",
  "R39",
  "R40",
  "R41",
  "R42",
  "S39",
  "S40",
  "S41",
  "S42",
  "T39",
  "T40",
  "T41",
  "T42",
  "U39",
  "U40",
  "U41",
  "U42",
  "V39",
  "V40",
  "V41",
  "V42",
];

export const price = {
  vip: 500,
  premier: 400,
  deluxe: 300,
};

export enum SeatStatusEnum {
  PENDING = "pending",
  RESERVED = "reserved",
  TAKEN = "taken",
  SELECTED = "selected",
  AVAILABLE = "available",
}

export enum SeatCategoryEnum {
  PREMIERE = "premiere",
  VIP = "vip",
  DELUXE = "deluxe",
}

export const maxDeluxeSeatCount = 3500;
