import { Group } from '../schema/group.schema';

export const getAvailability = (newGroup: Group, myGroups: Group[]) => {
  try {
    console.log('My Groups: ', myGroups);
    const available = myGroups.find((oneGroup) => isValid(newGroup, oneGroup));
    console.log('Available: ', available);
    return available;
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
