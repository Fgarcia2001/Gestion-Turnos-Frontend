// Igual que DateTime.AddMonths en .NET: mismo día del mes, clampeado al último
// día del mes destino si no existe (ej. 31 ene + 1 mes -> 28/29 feb, no marzo).
export const addMonthsClamped = (date, months) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDayOfTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDayOfTargetMonth));
  return target;
};
