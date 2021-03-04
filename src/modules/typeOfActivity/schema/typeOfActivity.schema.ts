import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TypeOfActivityDocument = TypeOfActivity & mongoose.Document;

@Schema({ timestamps: true })
export class TypeOfActivity {
  @Prop()
  name: string;
}
export const TypeOfActivitySchema = SchemaFactory.createForClass(TypeOfActivity);
