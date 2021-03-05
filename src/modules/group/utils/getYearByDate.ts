export const getYearOfPerson = (birthDate) => {
  const year = new Date().getFullYear();
  const date = new Date(birthDate);
  const personYear = date.getFullYear();
  const result = year - personYear;
  return result;
};
