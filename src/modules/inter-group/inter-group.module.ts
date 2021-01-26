import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterGroupService } from './inter-group.service';
import { InterGroupController } from './inter-group.controller';
import { InterGroup, InterGroupSchema } from './schema/inter-group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: InterGroup.name, schema: InterGroupSchema }])],
  controllers: [InterGroupController],
  providers: [InterGroupService]
})
export class InterGroupModule {}
