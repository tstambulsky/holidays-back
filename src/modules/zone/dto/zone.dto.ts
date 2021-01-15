import { Prop } from '@nestjs/mongoose';
import { State } from '../schema/state.schema';
import { Country } from '../schema/country.schema';

export class CreateCityDTO {
  @Prop({ required: true })
  readonly postalCode: number;
  @Prop({ required: true })
  readonly name: string;
  @Prop({ required: true })
  readonly state: State;
  @Prop({ default: true, required: true })
  readonly active?: boolean;
}

export class UpdateCityDTO {
  @Prop({ required: false })
  readonly postalCode?: number;
  @Prop({ required: false })
  readonly name?: string;
  @Prop({ required: false })
  readonly state?: State;
  @Prop({ default: true, required: false })
  readonly active?: boolean;
}

export class CreateStateDTO {
  @Prop({ required: true })
  readonly name: string;
  @Prop({ required: true })
  readonly country: Country;
  @Prop({ default: true, required: true })
  readonly active: boolean;
}

export class UpdateStateDTO {
  @Prop({ required: false })
  readonly name?: string;
  @Prop({ required: false })
  readonly country?: Country;
  @Prop({ default: true, required: false })
  readonly active?: boolean;
}

export class CreateCountryDTO {
  @Prop({ required: true })
  name: string;
  @Prop({ default: true, required: true })
  active: boolean;
}

export class UpdateCountryDTO {
  @Prop({ required: false })
  name?: string;
  @Prop({ default: true, required: false })
  active?: boolean;
}
