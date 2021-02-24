import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InterGroupService } from './interGroup.service'
import { InterGroupController } from './interGroup.controller'
import { InterGroup, InterGroupSchema } from './schema/interGroup.schema'

@Module({
   imports: [MongooseModule.forFeature([{ name: InterGroup.name, schema: InterGroupSchema }])],
   controllers: [InterGroupController],
   providers: [InterGroupService],
})
export class InterGroupModule {}
