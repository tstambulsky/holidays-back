import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Group, GroupSchema } from './schema/group.schema'
import { User, UserSchema } from '../users/schema/users.schema'

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
   ],
   controllers: [GroupController],
   providers: [GroupService],
})
export class GroupModule {}
