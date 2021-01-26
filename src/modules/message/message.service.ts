import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './schema/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) {}

  async getAll(): Promise<Message[]> {
    return this.messageModel.find();
  }

  async createMessage(sender: string, message: string): Promise<Message> {
    const newMessage = new this.messageModel({ sender, message });
    return await newMessage.save();
  }
}
