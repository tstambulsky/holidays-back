import { Injectable, HttpException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
import { UpdateUserDTO, queryDTO,  } from './dto/data.dto';
import { User, UserDocument } from './schema/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().populate('city').exec();
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

  async getUserById(userId: any): Promise<User> {
    try {
      const user = await this.userModel.findById({ _id: userId });
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateFB(accessToken: any, refreshToken: any, profile: any, done: any): Promise<User> {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id });
      console.log(profile)
      if (user) {
        return user;
      }
      const createUser = new this.userModel({
        provider: profile.provider,
        provider_id: profile.id,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      });
      await createUser.save();
      return createUser;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateInstagram(accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id });
      if (user) {
        return user;
      }
      const createUser = await new this.userModel({
        provider: profile.provider,
        provider_id: profile.provider.id,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
      });
      await createUser.save();
      return createUser;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createUser(userDTO: RegisterDTO): Promise<User> {
    const user = await new this.userModel(userDTO);
    await user.save();
    return user;
  }

  async findOneUser(data: any) {
    try {
      const search = await this.userModel.findOne(data);
      return search;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateUser(data: UpdateUserDTO, currentUser: any): Promise<User | undefined> {
    try {
      const userId = currentUser._id;
      const user = await this.userModel.findOne({ _id: userId });
      //agregar condicion para no hacer update en fb/insta/aple
      const updatedUser = await user.updateOne({ ...data });
      const userUpdated = await this.userModel.findOne({ _id: userId });
      return userUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveUser(userId: any): Promise<string> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new HttpException('Not Found', 404);
      }
      user.active = false;
      await user.save();
      return 'Meeting change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteUser(userId: any): Promise<string> {
    try {
      await this.userModel.deleteOne({ _id: userId });
      return 'User deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }


  async changeUserCalifications(userId: any, sum: boolean): Promise<User> {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) throw new Error('This user does not exist');
      user.points = sum ? user.points + 1 : user.points - 1;
      await user.save();
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchContact(users: any[]) {
    try {
      let allUsers = [];
      const usersFiltered = users.filter((element) => element.email !== null && element.phone !== null);
      for await (let user of usersFiltered) {
        const data = await this.userModel.findOne({ $or: [{ email: user.email }, { phoneNumber: user.phone }] });
        if (data) {
          allUsers.push(data);
        }
      }
      return allUsers;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async searchByName(name: queryDTO) {
    try {
      if(name.name.length === 0) throw new HttpException('Please, insert a name', 404)
      const users = await this.userModel.find({name:new RegExp(name.name, 'i') });
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
