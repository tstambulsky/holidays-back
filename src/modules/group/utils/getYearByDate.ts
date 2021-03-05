export const getYearOfPerson = (birthDate) => {
  const year = new Date().getFullYear();
  const date = new Date(birthDate);
  const AniosDePersona = date.getFullYear();
  const result = year - AniosDePersona;
  return result;
};
