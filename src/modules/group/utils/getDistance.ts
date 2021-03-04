//@ts-nocheck
import Distance from 'geo-distance';
import { Meeting } from 'src/modules/meeting-place/schema/meetingPlace.schema';

export const getDistaceBetween = (placeOne: Meeting, placeTwo: Meeting) =>
  Distance.between(cleanDistance(placeOne), cleanDistance(placeTwo));

export const checkRange = (placesDistance, maxDistance) => {
  if (placesDistance > Distance(`${maxDistance} km`)) {
    return true;
  }
  return false;
};

const cleanDistance = (place: Meeting) => {
  console.log('PLACE IN CLEAN', place);
  return {
    lat: place.latitude,
    lon: place.longitude
  };
};
