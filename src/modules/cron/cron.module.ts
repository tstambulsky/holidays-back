import { Module } from '@nestjs/common';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';
import { CronService } from './cron.service';

@Module({
  providers: [CronService, InterGroupService, GroupService]
})
export class CronModule {}
