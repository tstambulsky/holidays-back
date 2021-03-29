import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { InterGroupModule } from '../inter-group/interGroup.module';
import { CronService } from './cron.service';

@Module({
  imports: [InterGroupModule, GroupModule],
  providers: [CronService]
})
export class CronModule {}
