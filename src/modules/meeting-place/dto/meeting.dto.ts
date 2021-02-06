export class MeetingDTO {
  readonly name: string;
  readonly location: string;
  readonly address: string;
  readonly description: string;
  readonly photo: [string];
}

export class UpdateMeetingDTO {
  readonly name?: string;
  readonly address?: string;
  readonly location?: string;
  readonly description?: string;
  readonly photo?: [string];
}
