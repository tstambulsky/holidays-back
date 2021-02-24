import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CalificationDTO } from './dto/inputs.dto';
import { Calification, CalificationDocument } from './schemas/calification.schema';

@Injectable()
export class CalificationService {
  constructor(
    @InjectModel(Calification.name) private readonly calificationModel: Model<CalificationDocument>,
    private userService: UsersService
  ) {}

  async getCalifications(): Promise<Calification[]> {
    const califications = await this.calificationModel.find().populate('toUser').populate('fromUser').populate('interGroup').exec();
    if (!califications) {
      throw new HttpException('Not Found', 404);
    }
    return califications;
  }

  async createCalification(data: CalificationDTO) {
    try {
      const { toUser, fromUser, interGroup, success } = data;
      await this.userService.changeUserCalifications(toUser, success)
      const alreadyCalificated = await this.calificationModel.find({ toUser, fromUser, interGroup});
      if (alreadyCalificated.length > 0) throw new Error('This person already calificate the member of this intergroup');
      const calification = new this.calificationModel(data);
      await calification.save();
      return calification.populate('toUser').populate('fromUser').populate('interGroup');
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
