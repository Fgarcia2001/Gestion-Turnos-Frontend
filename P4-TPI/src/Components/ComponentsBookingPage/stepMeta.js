// Internal wizard steps (1-9). The visible stepper collapses these into 7 nodes,
// since business-type + business share one node, and client-info + review share another.
export const STEP = {
  BUSINESS_TYPE: 1,
  BUSINESS: 2,
  BRANCH: 3,
  SERVICE: 4,
  STAFF: 5,
  DATE_TIME: 6,
  CLIENT_INFO: 7,
  REVIEW: 8,
  CONFIRMATION: 9,
};

export const STEP_NODES = [
  { steps: [STEP.BUSINESS_TYPE, STEP.BUSINESS], labelKey: "selectBusiness", iconKey: "building" },
  { steps: [STEP.BRANCH], labelKey: "selectBranch", iconKey: "mapPin" },
  { steps: [STEP.SERVICE], labelKey: "selectService", iconKey: "clipboard" },
  { steps: [STEP.STAFF], labelKey: "selectProfessional", iconKey: "user" },
  { steps: [STEP.DATE_TIME], labelKey: "selectDateTime", iconKey: "calendar" },
  { steps: [STEP.CLIENT_INFO, STEP.REVIEW], labelKey: "yourInformation", iconKey: "clock" },
  { steps: [STEP.CONFIRMATION], labelKey: "appointmentConfirmed", iconKey: "check" },
];
