import { Injectable, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Contacts, ContactsDocument } from './schema/contacts.schema'
import { Model } from 'mongoose'

@Injectable()
export class ContactsService {
   constructor(@InjectModel(Contacts.name) private readonly contactsModel: Model<ContactsDocument>) {}

   async getContacts(): Promise<Contacts[]> {
      const contacts = await this.contactsModel.find()
      if (!contacts) {
         throw new HttpException('Not Found', 404)
      }
      return contacts
   }

   async createListContactsFB(accessToken: any, refreshToken: any, profile: any, done: any) {
      try {
         const contacts = await this.contactsModel.findOne({ contacts: profile.friends })
         if (!contacts) {
            const createListContacts = new this.contactsModel({
               contacts: profile.friends,
            })
            return createListContacts.save()
         }
      } catch (err) {
         console.log(err)
         throw new Error(err.message)
      }
   }

   async createListContactsInstagram(accessToken: any, refreshToken: any, profile: any, done: any) {
      try {
         const contacts = await this.contactsModel.findOne({ contacts: profile.friends })
         if (!contacts) {
            const createListContacts = new this.contactsModel({
               contacts: profile.friends,
            })
            return createListContacts.save()
         }
      } catch (err) {
         console.log(err)
         throw new Error(err.message)
      }
   }
}
