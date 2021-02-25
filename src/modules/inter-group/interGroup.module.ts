import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterGroupService } from './interGroup.service';
import { InterGroupController } from './interGroup.controller';
import { InterGroup, InterGroupSchema } from './schema/interGroup.schema';
import { GroupModule } from '../group/group.module';
import { InvitationInterGroup, InvitationInterGroupSchema } from './schema/invitation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: InterGroup.name, schema: InterGroupSchema }, 
  	{name: InvitationInterGroup.name, schema: InvitationInterGroupSchema}]), 
  forwardRef(() => GroupModule) 
  ],
  controllers: [InterGroupController],
  providers: [InterGroupService],
  exports: [InterGroupService]
})
export class InterGroupModule {}
