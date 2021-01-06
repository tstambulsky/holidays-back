import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './dto/data.dto';
import { LoginDTO } from '../auth/dto/login.dto';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find();
    if (!users) {
      throw new HttpException('Not Found', 404);
    }
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }, (err, obj) => {
      if (err) return console.log(err);
      console.log(obj);
    });
    return user;
  }

  async getUserById(userID: string): Promise<User> {
    const user = await this.userModel.findById(userID);
    console.log(user);
    return user;
  }

  async createUser(userDTO: UserDTO): Promise<User> {
    const user = await new this.userModel(userDTO);
    return user.save();
  }
}
