import { Group } from '../schema/group.schema';

export const getAvailability = (newGroup: Group, myGroups: Group[]) => {
  try {
    const available: any = myGroups.find((oneGroup) => isValid(newGroup, oneGroup));
    if(available) return true 
    return false
  } catch (error) {
    throw new Error(error.message);
  }
};

const isValid = (newGroup: Group, myGroup: Group) => {
  const newGroupStart = newGroup.startDate.getTime();
  const newGroupEnd = newGroup.endDate.getTime();
  const myGroupStart = myGroup.startDate.getTime();
  const myGroupEnd = myGroup.endDate.getTime();
  const valid =
    newGroupStart >= myGroupStart &&
    newGroupStart <= myGroupEnd &&
    newGroupEnd >= myGroupStart &&
    newGroupEnd <= myGroupEnd &&
    myGroupStart >= newGroupStart &&
    myGroupStart <= newGroupEnd;
  console.log('Valid: ', valid);
  return !valid;
};
