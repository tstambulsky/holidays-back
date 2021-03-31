import { Group } from '../schema/group.schema';

export const getAvailability = (newGroup: Group, myGroups: Group[]) => {
  try {
    let check = [];
    myGroups.forEach((oneGroup) => {
      const response = isValid(newGroup, oneGroup);
      check.push(response);
    });
    if (check.some((data) => !data)) return false;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const isValid = (newGroup: Group, myGroup: Group) => {
  const newGroupStart = newGroup.startDate.getTime();
  const newGroupEnd = newGroup.endDate.getTime();
  const myGroupStart = myGroup.startDate.getTime();
  const myGroupEnd = myGroup.endDate.getTime();
  const notValid =
    (newGroupStart >= myGroupStart && newGroupStart <= myGroupEnd) ||
    (newGroupEnd >= myGroupStart && newGroupEnd <= myGroupEnd) ||
    (myGroupStart >= newGroupStart && myGroupStart <= newGroupEnd);
  console.log('Valid from isValid: ', !notValid);
  return !notValid;
};
