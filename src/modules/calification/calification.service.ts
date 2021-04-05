import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupService } from '../group/group.service';
import { InterGroupService } from '../inter-group/interGroup.service';
import { UsersService } from '../users/users.service';
import { CalificationDTO } from './dto/inputs.dto';
import { Calification, CalificationDocument } from './schemas/calification.schema';

@Injectable()
export class CalificationService {
  constructor(
    @InjectModel(Calification.name) private readonly calificationModel: Model<CalificationDocument>,
    private interGroupService: InterGroupService,
    private userService: UsersService,
    private groupService: GroupService
  ) {}

  async getCalifications(): Promise<Calification[]> {
    const califications = await this.calificationModel.find().populate('toUser').populate('fromUser').populate('interGroup').exec();
    if (!califications) {
      throw new HttpException('Not Found', 404);
    }
    return califications;
  }

  async createCalification(data: CalificationDTO, currentUser: any) {
    try {
      const userId = currentUser._id;
      const { toUser, interGroup, success } = data;
      await this.userService.changeUserCalifications(toUser, success)
      const alreadyCalificated = await this.calificationModel.find({ toUser, fromUser: userId, interGroup});
      if (alreadyCalificated.length > 0) throw new Error('This person already calificate the member of this intergroup');
      const calification = new this.calificationModel(data);
      calification.fromUser = userId;
      await calification.save();
      return calification.populate('toUser').populate('fromUser').populate('interGroup');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUsersWithoutCalifications(interGroupId: any, currentUser: any) {
    try {
      const userId = currentUser._id;
      let usersWithoutCalification = [];
      const interGroup = await this.interGroupService.getInterGroup(interGroupId);
      const groupOne: any = await this.groupService.getGroup(interGroup.groupSender);
      const groupTwo: any = await this.groupService.getGroup(interGroup.groupReceiver);
      for await (let integrant of groupOne.integrants) {
        const calification = await this.calificationModel.findOne({fromUser: userId, toUser: integrant._id});
        if (!calification && integrant._id != userId) {
          usersWithoutCalification.push(integrant._id);
        }
      }
      for await (let integrant of groupTwo.integrants) {
        const calification = await this.calificationModel.findOne({fromUser: userId, toUser: integrant._id});
        if (!calification && integrant._id != userId) {
          usersWithoutCalification.push(integrant._id);
        }
      }
      return usersWithoutCalification;
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
