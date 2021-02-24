import { Prop } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export class CreateCityDTO {
   @Prop({ required: true })
   readonly postalCode: number
   @Prop({ required: true })
   readonly name: string
   @Prop({ required: true })
   readonly state: mongoose.Types.ObjectId
   @Prop({ default: true, required: true })
   readonly active?: boolean
}

export class UpdateCityDTO {
   @Prop({ required: false })
   readonly postalCode?: number
   @Prop({ required: false })
   readonly name?: string
   @Prop({ required: false })
   readonly state?: mongoose.Types.ObjectId
   @Prop({ default: true, required: false })
   readonly active?: boolean
}

export class CreateStateDTO {
   @Prop({ required: true })
   readonly name: string
   @Prop({ required: true })
   readonly country: mongoose.Types.ObjectId
   @Prop({ default: true, required: true })
   readonly active: boolean
}

export class UpdateStateDTO {
   @Prop({ required: false })
   readonly name?: string
   @Prop({ required: false })
   readonly country?: mongoose.Types.ObjectId
   @Prop({ default: true, required: false })
   readonly active?: boolean
}

export class CreateCountryDTO {
   @Prop({ required: true })
   name: string
   @Prop({ default: true, required: true })
   active: boolean
}

export class UpdateCountryDTO {
   @Prop({ required: false })
   name?: string
   @Prop({ default: true, required: false })
   active?: boolean
}
