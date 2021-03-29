import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly groupService: GroupService, private readonly intergroupService: InterGroupService) {}

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async changeToInactiveGroups() {
    this.logger.debug('Every hour check groups');
    try {
      const groups = await this.groupService.getGroups();
      for await (let group of groups) {
        const endDate = group.endDate.getTime();
        const now = new Date().getTime();
        if (endDate > now) {
          console.log('Change to inactive: ', group);
          await this.groupService.toInactiveGroup(group);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async changeToInactiveIntergroups() {
    this.logger.debug('Every hour check intergroups');
    try {
      const intergroups = await this.intergroupService.getInterGroups();
      for await (let inter of intergroups) {
        const endDate = inter.endDate.getTime();
        const now = new Date().getTime();
        if (endDate > now) {
          console.log('Change to inactive intergroup: ', inter);
          await this.intergroupService.toInactiveInterGroup(inter);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
