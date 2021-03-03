import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TypeOfActivity, TypeOfActivityDocument } from './schema/TypeOfActivity.schema';
import { TypeActivityDTO } from './dto/typeOfActivity.dto';
import { Model } from 'mongoose';

@Injectable()
export class TypeOfActivityService {
  constructor(@InjectModel(TypeOfActivity.name) private readonly typeOfActivityModel: Model<TypeOfActivityDocument>) {}

  async getTypes(): Promise<TypeOfActivity[]> {
    try {
      const types = await this.typeOfActivityModel.find();
      if(!types) throw new HttpException('Do not have types of activities', 404);
      return types;
    } catch (err) {
      throw new Error(err.message);
  }
  }  

async getType(typeId: any) {
  try {
    const type = await this.typeOfActivityModel.findOne({ _id: typeId});
    if (!type) throw new HttpException('No matches', 404);
      return type;
  } catch (err) {
    throw new Error(err.message);
  }
}

async createType(data:TypeActivityDTO): Promise<string> {
  try {
    const createType = new this.typeOfActivityModel(data);
    await createType.save();
    return 'Type of activity created!'
  } catch (err) {
    throw new Error (err.message)
  }
}

async updateType(typeId: any, data: TypeActivityDTO): Promise<TypeOfActivity> {
  try {
    const type = await this.typeOfActivityModel.findOne({ _id: typeId});
    if(!type) throw new HttpException('No matches', 404);
      const updatedType = await type.updateOne({ ...data });
      const typeUpdated = await this.typeOfActivityModel.findOne({ _id: typeId });
      return typeUpdated;
  } catch (err) {
    throw new Error(err.message)
  }
}

  async deleteType(typeId: any): Promise<string> {
    try {
      await this.typeOfActivityModel.deleteOne({ _id: typeId });
      return 'Type of activity deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
