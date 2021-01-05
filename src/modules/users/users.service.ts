import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './dto/data.dto';
import { IUser } from './interfaces/users.interface';
import { UserSchema } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async getUsers(): Promise<UserDTO[]> {
    const users = await this.userModel.find().exec();
    if (!users || users[0]) {
      throw new HttpException('Not Found', 404);
    }
    return users;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const user = await this.userModel.findOne({ where: { email } });
    return user;
  }

  async getUserById(userID: string): Promise<UserDTO> {
    const user = await this.userModel.findById(userID);
    console.log(user);
    return user;
  }

  /*async createUser(newUser: UserDTO) {
    const user = await new this.userModel(newUser);
    return user.save();
  } */
}
