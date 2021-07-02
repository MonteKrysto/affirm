export const isRequired = config => value => value === "" || value == null ? config.message : null;

export const isNumber = config => value => {
  return typeof value === "number" ? null : config.message;
};

export const isLength = config => value => value.length === config.length ? null : config.message;

export const isMinLength = config => value => value.length >= config.length ? null : config.message;

export const isCardNumberCorrect = config => value => {
  return config.cardType && !config.cardType.regex.test(value.toString()) ? config.message : null;
};

