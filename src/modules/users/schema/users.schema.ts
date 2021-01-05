import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,

  lastName: String,

  DNI: Number,

  email: String,

  phoneNumber: Number,

  birthDate: Date,

  password: String,
  /* 
  @Prop({ type:[Types.ObjectId], ref: 'City'})
  city: string;
  */
  addressStreet: String,

  addressNumber: Number,

  addressFloor: Number,

  addressApartment: String,

  createdAt: Date,

  updatedAt: Date

  /*
  @Prop({ type: [Types.ObjectId], ref: 'Screen' })
  screen: string;
  
  @Prop({ type: [Types.ObjectId], ref: 'Rol' })
  rol: string;
}]*/
});


export default mongoose.model('User', UserSchema);