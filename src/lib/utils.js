export function invariant(condition, message) {
  if (process.env.NODE_ENV === "production" || condition) {
    return;
  }

  throw new Error("useValidation: " + message);
}

export const INVALID_TYPE = "Invalid type, see console for details.";

const cardOptions = {
  amex: {
    mask: "0000 000000 00000",
    regex: /^(?:3[47][0-9]{2})[\s,](?:[0-9]{6})[\s,](?:[0-9]{5})$/,
    image: "amex",
    maxLen: 17,
    cvcLen: 4,
  },
  visa: {
    mask: "0000 0000 0000 0000",
    regex: /^(?:4[0-9]{3})[\s,]([0-9]{4})[\s,]([0-9]{4})[\s,]([0-9]{4})$/,
    image: "visa",
    maxLen: 19,
    cvcLen: 3,
  },
  unknown: {
    mask: "0000 0000 0000 0000",
    regex: /^([0-9]{4})[\s,]([0-9]{4})[\s,]([0-9]{4})[\s,]([0-9]{4})$/,
    image: "unknown",
    maxLen: 19,
    cvcLen: 3,
  },
};

export const getCardType = value => {
  const cardPrefix = value?.slice(0, 2) || "";
  if (cardPrefix === "37" || cardPrefix === "34") {
    return cardOptions.amex;
  } else if (cardPrefix[0] === "4") {
    return cardOptions.visa;
  } else {
    return cardOptions.unknown;
  }
};

const clean = (value, pattern) => {
  const slots = new Set("0");
  const accept = new RegExp("\\d", "g");

  value = value.match(accept) || [];

  return Array.from(pattern, c => (value[0] === c || slots.has(c) ? value.shift() || " " : " "));
};

export const formatNumber = (card, value) => {
  const pattern = card.mask;

  return clean(value, pattern).join("").trim();
};
