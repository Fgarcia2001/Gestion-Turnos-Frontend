// Internal wizard steps (1-7). The visible stepper collapses these into 5 nodes,
// since client-info + review share one node. The business and branch are always
// resolved before the wizard opens (from the business's public page), so there's
// no "pick a business" step here.
export const STEP = {
  BRANCH: 1,
  SERVICE: 2,
  STAFF: 3,
  DATE_TIME: 4,
  CLIENT_INFO: 5,
  REVIEW: 6,
  CONFIRMATION: 7,
};

export const STEP_NODES = [
  { steps: [STEP.BRANCH], labelKey: "selectBranch", iconKey: "mapPin" },
  { steps: [STEP.SERVICE], labelKey: "selectService", iconKey: "clipboard" },
  { steps: [STEP.STAFF], labelKey: "selectProfessional", iconKey: "user" },
  { steps: [STEP.DATE_TIME], labelKey: "selectDateTime", iconKey: "calendar" },
  { steps: [STEP.CLIENT_INFO, STEP.REVIEW], labelKey: "yourInformation", iconKey: "clock" },
  { steps: [STEP.CONFIRMATION], labelKey: "appointmentConfirmed", iconKey: "check" },
];
