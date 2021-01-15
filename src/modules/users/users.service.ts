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

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email: email }, (err, obj) => {
        if (err) console.log(err);
      });
      if (!user) throw new NotFoundException('Not user exist');
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async getUserById(userID: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userID);
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreate(accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id }, (err, user) => {
        if (err) throw err;
        if (!err && user != null) return done(null, user);
        const createdUser = new this.userModel({
          provider_id: profile.id,
          provider: profile.provider,
          name: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        });
        return createdUser.save(function (err) {
          if (err) throw err;
          done(null, user);
        });
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async createUser(userDTO: UserDTO): Promise<User> {
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
}
