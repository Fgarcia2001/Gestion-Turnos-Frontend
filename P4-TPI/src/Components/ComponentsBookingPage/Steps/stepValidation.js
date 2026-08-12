const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{6,20}$/;

// IDs can legitimately be 0 (e.g. the first business type), so completion checks
// must use != null rather than Boolean(), which treats 0 as falsy/incomplete.
export const isBusinessTypeStepComplete = (booking) => booking.businessTypeId != null;
export const isBusinessStepComplete = (booking) => booking.businessId != null;
export const isBranchStepComplete = (booking) => booking.branchId != null;
export const isServiceStepComplete = (booking) => booking.serviceId != null;
export const isStaffStepComplete = (booking) => booking.staffId != null;
export const isDateTimeStepComplete = (booking) => Boolean(booking.day) && booking.startTime != null;

export const validateClientInfo = (booking, t) => {
  const errors = {};
  if (!booking.clientName?.trim()) errors.clientName = t("nameRequired") || "Full name is required.";
  if (!booking.clientEmail?.trim()) errors.clientEmail = t("emailRequired") || "Email is required.";
  else if (!EMAIL_RE.test(booking.clientEmail)) errors.clientEmail = t("emailInvalid") || "Enter a valid email.";
  if (!booking.clientPhone?.trim()) errors.clientPhone = t("phoneRequired") || "Phone is required.";
  else if (!PHONE_RE.test(booking.clientPhone)) errors.clientPhone = t("phoneInvalid") || "Enter a valid phone number.";
  if (!booking.clientBirthDay) errors.clientBirthDay = t("birthDayRequired") || "Date of birth is required.";
  return errors;
};

export const isClientInfoStepComplete = (booking, t) =>
  Object.keys(validateClientInfo(booking, t)).length === 0;
