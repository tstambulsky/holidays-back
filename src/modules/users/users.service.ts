import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/users.interface';
import { CreateUserDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('Users') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find();
      return users;
    } catch (err) {
      throw new Error(err);
      console.log(err);
    }
  }

  async getOneUser(userID: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userID);
      return user;
    } catch (err) {
      throw new Error(err);
      console.log(err);
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = new this.userModel(createUserDTO);
      return await user.save();
    } catch (err) {
      throw new Error(err);
      console.log(err);
    }
  }

  async updateUser(userID: string, createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndUpdate(userID, createUserDTO, { new: true });
      return user;
    } catch (err) {
      throw new Error(err);
      console.log(err);
    }
  }

  async deleteUser(userID: string): Promise<string> {
    try {
      await this.userModel.findByIdAndDelete(userID);
      return 'Usuario eliminado correctamente';
    } catch (err) {
      throw new Error(err);
      console.log(err);
    }
  }
}
