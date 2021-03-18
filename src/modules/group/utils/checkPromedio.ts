export const checkPromedio = (groupAvarage: number, average: number): boolean => {
  const range: number = 3;
  const maxAge: number = +average + range;
  const minAge: number = average - range;
  const isOn: boolean = groupAvarage <= maxAge && groupAvarage >= minAge;
  return isOn;
};
