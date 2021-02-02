import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
import { UserDTO, UpdateUserDTO } from './dto/data.dto';
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

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: email });
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async getUserById(userID: any): Promise<User> {
    try {
      const user = await this.userModel.findById({ _id: userID });
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateFB(accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id });
        const createUser = await new this.userModel({
          provider: profile.provider,
          provider_id: profile.provider.id,
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          //email: profile.emails[0].value || 'not found',
          photo: profile.photos[0].value
        });
        return createUser.save();
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateInstagram(accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id });
      const createUser = await new this.userModel({
        provider: profile.provider,
        provider_id: profile.provider.id,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      });
      return createUser.save();
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createUser(userDTO: RegisterDTO): Promise<User> {
    const user = await new this.userModel(userDTO);
    return user.save();
  }

  async findOneUser(data: any) {
    try {
      const search = await this.userModel.findOne(data);
      return search;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateUser(userID: any, data: UpdateUserDTO): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ _id: userID });
      //agregar condicion para no hacer update en fb/insta/aple
      const updatedUser = await user.updateOne({ ...data });
      const userUpdated = await this.userModel.findOne({ _id: userID });
      return userUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteUser(userID: any): Promise<string> {
    try {
      await this.userModel.deleteOne({ _id: userID });
      return 'User deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
