import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ContactsDocument = Contacts & mongoose.Document;

@Schema()
export class Contacts {
  @Prop({ type: [String] })
  contacts: string;
}
export const ContactsSchema = SchemaFactory.createForClass(Contacts);

ContactsSchema.set('timestamps', true);
