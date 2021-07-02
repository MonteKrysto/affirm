import { invariant } from "./utils";

const validateConfigSchema = config => {
  // We don't want to show these warnings in production
  if (process.env.NODE_ENV === "production") {
    return;
  }

  if (typeof config === "function") {
    config = config({});
  }

  invariant(
    typeof config === "object",
    `useValidation should be called with an object or a function returning an object. You passed a ${typeof config}.`
  );

  invariant(
    typeof config.fields === "object",
    "useValidation requires a `field` prop with an object containing the fields and their validators. Please refer to the documentation on usage: https://link.to/docs"
  );

  invariant(
    Object.values(config.fields).every(field => typeof field === "object"),
    "useValidation requires that the `field` object only contains objects. It looks like yours isn't. Please refer to the documentation on usage: https://link.to/docs"
  );

  for (let fieldName in config.fields) {
    const fieldsConfig = config.fields[fieldName];

    for (let validatorName in fieldsConfig) {
      if (["initialValue"].includes(validatorName)) {
        continue;
      }
    }
  }

  invariant(
    ["always", "blur", "submit", undefined].includes(config.showErrors),
    'useValidation received an unsupported value in the `showError` prop. Valid values are "always", "blur" or "submit".'
  );

  // We can add more
};

export default validateConfigSchema;
