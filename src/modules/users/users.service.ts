import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDTO } from '../auth/dto/register.dto';
import { UpdateUserDTO, queryDTO, PhotoDTO } from './dto/data.dto';
import { User, UserDocument } from './schema/users.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { removeImage } from './utils/deleteImage';
import { NotificationService } from '../notification/notification.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CloudinaryService) private readonly _cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    if (!users) {
      throw new HttpException('Not Found', 404);
    }
    return users;
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ active: true, email: email });
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async getUserById(userId: any): Promise<User> {
    try {
      const user = await this.userModel.findById({ _id: userId });
      //if (user.deviceToken) await this.notificationService.testNotification(user.deviceToken); 
      //console.log('devicetoken', user.deviceToken);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateFB(accessToken: any, refreshToken: any, profile: any, done: any): Promise<User> {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id || accessToken});
      if (user) {
        const userToLogin: any = await this.authService.loginSocial(user.email, user.provider_id);
        return userToLogin;
      }
      const createUser = new this.userModel({
        provider: profile.provider,
        provider_id: profile.id,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profilePhoto: profile.photos[0].value,
        accessToken: accessToken
      });
      await createUser.save();
     const login: any = await this.authService.loginSocial(createUser.email, createUser.provider_id);
     return login;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async findOrCreateInstagram(accessToken: any, refreshToken: any, profile: any, done: any) {
    try {
      const user = await this.userModel.findOne({ provider_id: profile.id });
      if (user) {
       const userToLogin: any = await this.authService.loginSocial(user.email, user.provider_id);
        return userToLogin;
      }
      const createUser = await new this.userModel({
        provider: profile.provider,
        provider_id: profile.provider.id,
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profilePhoto: profile.photos[0].value,
        accessToken: accessToken,
      });
      await createUser.save();
      const login: any = await this.authService.loginSocial(createUser.email, createUser.provider_id);
      return login;
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
      if (!search) throw new HttpException('User not found', 404);
      return search;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateUserLogged(data: UpdateUserDTO, currentUser: any): Promise<User | undefined> {
    try {
      const userId = currentUser._id;
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) throw new HttpException('You dont have access to do this action', 404);
      const updatedUser = await user.updateOne({ ...data });
      const userUpdated = await this.userModel.findOne({ _id: userId });
      return userUpdated;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateUser(data: UpdateUserDTO, userId: any): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) throw new HttpException('User no exist', 404);
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
      return 'User change to inactive';
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
      if (sum === true) {
        user.pointsPositive = user.pointsPositive + 1;
      } else {
        user.pointsNegative = user.pointsNegative + 1;
      }
      await user.save();
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async searchContact(users: any[]) {
    try {
      let allUsers = [];
      const usersFiltered = users.filter((element) => element.email !== null && element.phone !== null && element.provider_id !== null);
      for await (let user of usersFiltered) {
        const data = await this.userModel.findOne({ $or: [{ email: user.email }, { phoneNumber: user.phone }, { provider_id: user.providerId }] });
        if (data !== null) {
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
      if (name.name.length === 0) throw new HttpException('Please, insert a name', 404);
      const users = await this.userModel.find({ name: new RegExp(name.name, 'i') });
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePhoto(data: PhotoDTO, currentUser: any): Promise<User | undefined> {
    try {
      const userId = currentUser._id;
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) throw new HttpException('You dont have access to do this action', 404);
      const updatePhotoUser = await user.updateOne({ ...data });
      const photosUpdated = await this.userModel.findOne({ _id: userId });
      return photosUpdated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async setProfilePhoto(currentUser: any, file: any, url: any) {
    try {
      const userId = currentUser._id;
      const user = await this.userModel.findOne({ _id: userId });
      const userUpdated = await user.updateOne({ profilePhoto: url });
      await removeImage(file.path);
      return userUpdated;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePhotos(currentUser: any, files: any) {
    try {
      const userId = currentUser._id;
      for await (let file of files) {
        const data = await this._cloudinaryService.upload(file.path);
        const user = await this.userModel.findOne({ _id: userId });
        user.photos.push({ photoUrl: data.url, public_id: file.filename });
        await user.save();
        await removeImage(file.path);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getByDeviceToken(token: string) {
    try {
      const search = await this.userModel.findOne({ deviceToken: token });
      return search;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserTestToken(userId: any): Promise<User> {
    try {
      const user = await this.userModel.findById({ _id: userId });
      if (user.deviceToken) await this.notificationService.testNotification(user.deviceToken); 
      console.log('devicetoken', user.deviceToken);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
}
