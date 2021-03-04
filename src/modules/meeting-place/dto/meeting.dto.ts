export class MeetingDTO {
  readonly name: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly description: string;
  readonly photo: string;
}

export class UpdateMeetingDTO {
  readonly name?: string;
  readonly address?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly description?: string;
  readonly photo?: string;
}
