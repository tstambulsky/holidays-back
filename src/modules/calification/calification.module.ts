import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupModule } from '../group/group.module';
import { InterGroupModule } from '../inter-group/interGroup.module';
import { UsersModule } from '../users/users.module';
import { CalificationController } from './calification.controller';
import { CalificationService } from './calification.service';
import { Calification, CalificationSchema } from './schemas/calification.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Calification.name, schema: CalificationSchema }]), UsersModule, InterGroupModule, GroupModule],
  controllers: [CalificationController],
  providers: [CalificationService],
  exports: [CalificationService]
})
export class CalificationModule {}
