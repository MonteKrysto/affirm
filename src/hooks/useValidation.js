import * as validators from "../lib/validators";
import { useReducer, useMemo, useEffect } from "react";
import validateConfigSchema from "../lib/validateConfigSchema";

/**
 * A validation method to test the rules against the value
 *
 * @param {strind} fieldValue - The value of the field to be validated
 * @param {object} fieldConfig - The configuration of the validation rules the value will be tested against
 */
function validateField(fieldValue = "", fieldConfig) {
  const specialProps = ["initialValue"];

  for (let validatorName in fieldConfig) {
    if (specialProps.includes(validatorName)) {
      continue;
    }
    let validatorConfig = fieldConfig[validatorName];
    if (typeof validatorConfig === "string") {
      validatorConfig = { message: validatorConfig };
    }

    // Call the curried validator with the config and value
    const errorMessage = validators[validatorName](validatorConfig)(fieldValue);

    if (errorMessage) {
      return errorMessage;
    }
  }
  return null;
}

/**
 * Validate all fields
 *
 * @param {array} fieldValues - All the forms field values
 * @param {array} fieldConfigs - All the validation rules for each field
 */
function validateFields(fieldValues, fieldConfigs) {
  const errors = {};

  for (let fieldName in fieldConfigs) {
    const fieldConfig = fieldConfigs[fieldName];
    const fieldValue = fieldValues[fieldName];

    errors[fieldName] = validateField(fieldValue, fieldConfig);
  }
  return errors;
}

/**
 * Gets the initial state of the hook
 *
 * @param {object} config - The configuration object for the useValidation hook
 */
function getInitialState(config) {
  const initialValues = {};
  const initialBlurred = {};

  if (typeof config === "function") {
    config = config({});
  }

  // Create the initial state of each field in the config that is passed in
  for (let fieldName in config.fields) {
    initialValues[fieldName] = config.fields[fieldName].initialValue || "";
    initialBlurred[fieldName] = false;
  }

  // Merge the custom validators into the existing validators
  Object.assign(validators, config.customValidators);
  const initialErrors = validateFields(initialValues, config.fields);

  return {
    values: initialValues,
    errors: initialErrors,
    blurred: initialBlurred,
    submitted: false,
  };
}

/**
 * Update the forms state when action is called
 *
 * @param {object} state - State of form
 * @param {string} action - The action to take based on an event
 */
function validationReducer(state, action) {
  switch (action.type) {
    case "change":
      const values = { ...state.values, ...action.payload };
      return {
        ...state,
        values,
      };
    case "submit":
      return { ...state, submitted: true };
    case "validate":
      return { ...state, errors: action.payload };
    case "blur":
      const blurred = {
        ...state.blurred,
        [action.payload]: true,
      };
      return { ...state, blurred };
    case "reset":
      return { ...state, ...action.state };
    default:
      throw new Error("Unknown action type");
  }
}

/**
 * Gets the errors in the form
 *
 * @param {object} state - State of form
 * @param {object} config - The validation configuration object
 */
function getErrors(state, config) {
  if (config.showErrors === "always") {
    return state.errors;
  }
  if (config.showErrors === "blur") {
    return Object.entries(state.blurred)
      .filter(([, blurred]) => blurred)
      .reduce((acc, [name]) => ({ ...acc, [name]: state.errors[name] }), {});
  }

  if (state.submitted) {
    return state.errors;
  } else {
    return {};
  }
}

/**
 * Entry point into hook
 * Validates the configuration schema
 *
 * @param {object} config - The configuration object
 */
const useValidation = config => {
  validateConfigSchema(config);

  const [state, dispatch] = useReducer(validationReducer, getInitialState(config));

  if (typeof config === "function") {
    config = config(state.values);
  }

  // Whenever the field values or the fields change run the validation method
  useEffect(() => {
    const errors = validateFields(state.values, config.fields);

    dispatch({ type: "validate", payload: errors });
  }, [state.values]);

  // Use a memoized method so that we don't create multiple function references
  const errors = useMemo(() => getErrors(state, config), [state, config]);

  // Check to see if there are errors
  const isFormValid = useMemo(() => Object.values(errors).every(error => error === null), [errors]);

  // Check if the form has been touched
  const isFormPristine = Boolean(Object.values(state.values).every(value => value === ""));

  /**
   * Return an object back to the form that is implementing the hook
   *
   * getFormProps - function - Returns the onSubmit event handler which updates the state in the hook state before returning it to the form to handle its own onSubmit handler
   * getFieldProps - function -  Returns the onChange and onBlur event handlers.  Updates the hook state then, if overrides is present, calls the event handler in the parent form
   *    @param {string} fieldName - The name of the field
   *    @param {object} overrides - An object that specifies which event handlers to override in order to bubble up to the form implementing it
   *
   * */
  return {
    errors,
    submitted: state.submitted,
    isFormValid,
    isFormPristine,
    getFormProps: () => ({
      onSubmit: e => {
        e.preventDefault();

        dispatch({ type: "submit" });

        if (config.onSubmit) {
          config.onSubmit({ ...state, isFormValid });
        }
      },
    }),
    getFieldProps: (fieldName, overrides = {}) => ({
      onChange: e => {
        const { value } = e.target;

        if (!config.fields[fieldName]) {
          return;
        }

        // Check if there is a special rule to be applied before updating state with value
        if (!overrides.rule || overrides.rule(e.target.value)) {
          dispatch({
            type: "change",
            payload: { [fieldName]: value },
          });
        }
        if (overrides.onChange) {
          overrides.onChange(e);
        }
      },
      onBlur: e => {
        dispatch({ type: "blur", payload: fieldName });
        if (overrides.onBlur) {
          overrides.onBlur(e);
        }
      },
      name: overrides.name || fieldName,
      value: (overrides.value && overrides.value[fieldName]) || state.values[fieldName],
    }),
    resetFields: config => dispatch({ type: "reset", state: getInitialState(config) }),
  };
};

export default useValidation;
