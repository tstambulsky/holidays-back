import { Schema } from 'mongoose';

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        DNI: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        /*city: [{
	type: Schema.Types.ObjectId,
	ref: 'Zone',
}],*/
        password: {
            type: String,
            required: true
        },
        addressStreet: {
            type: String,
            required: true
        },
        addressNumber: {
            type: Number,
            required: true
        },
        addressFloor: {
            type: Number
        },
        addressApartment: {
            type: String
        }
        /*screen: [{
	type: Schema.Types.ObjectId,
	ref: 'Screen',

}],
rol: [{
	type: Schema.Types.ObjectId,
	ref: 'Rol',
}]*/
    },
    {
        timestamps: true
    }
);
