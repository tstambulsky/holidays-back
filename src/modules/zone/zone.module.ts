import { Module } from '@nestjs/common'
import { ZoneController } from './zone.controller'
import { ZoneService } from './zone.service'
import { MongooseModule } from '@nestjs/mongoose'
import { City, CitySchema } from './schema/city.schema'
import { State, StateSchema } from './schema/state.schema'
import { Country, CountrySchema } from './schema/country.schema'

@Module({
   imports: [
      MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
      MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
      MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
   ],
   controllers: [ZoneController],
   providers: [ZoneService],
})
export class ZoneModule {}
