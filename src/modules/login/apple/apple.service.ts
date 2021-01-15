import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Apple, UserAppleDocument } from './schema/apple.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AppleService {
  constructor(@InjectModel(Apple.name) private readonly appleModel: Model<UserAppleDocument>) {}

  /*async UpdateOne(data: any, data1: any, data2: any) {
    const user = await this.appleModel.findOneAndUpdate({ data }, { data1 }, { data2 });
  }*/
}
