import { Meeting } from 'src/modules/meeting-place/schema/meetingPlace.schema';
import { ILocation } from '../interfaces/location.interface';

const cleanDistance = (place: any) => {
  return {
    latitude: place.latitude,
    longitude: place.longitude
  };
};

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);
const radiansToDegrees = (radians: number) => radians * (180 / Math.PI);

const centralSubtendedAngle = (locationX: ILocation, locationY: ILocation) => {
  const locationXLatRadians = degreesToRadians(locationX.latitude);
  const locationYLatRadians = degreesToRadians(locationY.latitude);
  return radiansToDegrees(
    Math.acos(
      Math.sin(locationXLatRadians) * Math.sin(locationYLatRadians) +
        Math.cos(locationXLatRadians) *
          Math.cos(locationYLatRadians) *
          Math.cos(degreesToRadians(Math.abs(locationX.longitude - locationY.longitude)))
    )
  );
};

const earthRadius = 6371;
const greatCircleDistance = (angle: number) => 2 * Math.PI * earthRadius * (angle / 360);

export const distanceBetweenLocations = (user: any, locationY: Meeting): number => {
  const fromLocation = cleanDistance(user);
  const toLocation = cleanDistance(locationY);
  const distance = greatCircleDistance(centralSubtendedAngle(fromLocation, toLocation));
  return distance;
};
