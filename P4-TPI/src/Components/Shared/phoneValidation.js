import { isValidPhoneNumber } from "react-phone-number-input";

// Formato generico (via libphonenumber-js), no atado a un pais fijo.
export const isValidPhone = (value) => !!value && isValidPhoneNumber(value);
