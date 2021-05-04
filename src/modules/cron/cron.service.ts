import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly groupService: GroupService, private readonly intergroupService: InterGroupService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async changeToInactiveGroups() {
    this.logger.debug('Every 30 minutes check groups');
    try {
      const groups = await this.groupService.getGroups();
      for await (let group of groups) {
        const endDate = group.endDate ? group.endDate.getTime() : null;
        const now = new Date().getTime();
        if (endDate < now || !endDate) {
          console.log('Change to inactive group: ', group.name);
          await this.groupService.toInactiveGroup(group);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async changeToInactiveIntergroups() {
    this.logger.debug('Every 30 minutes check intergroups');
    try {
      const intergroups = await this.intergroupService.getInterGroups();
      for await (let inter of intergroups) {
        if (inter.meetingPlaceOne && inter.startDate && inter.endDate ) {
        const endDate = inter.endDate ? inter.endDate.getTime() : null;
        const now = new Date().getTime();
        if (endDate < now || !endDate) {
          console.log('Change to inactive intergroup: ', inter.name);
          await this.intergroupService.toInactiveInterGroup(inter);
        }
      } else {
        console.log('left accept proposal')
      }
    }
    } catch (error) {
      console.log(error);
    }
  }
}
