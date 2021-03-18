import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { MeetingPlaceModule } from './modules/meeting-place/meetingPlace.module';
import { ChatModule } from './modules/chat/chat.module';
import { RolModule } from './modules/rol/rol.module';
import { GroupModule } from './modules/group/group.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CommentModule } from './modules/comment/comment.module';
import { TypeOfActivityModule } from './modules/typeOfActivity/typeOfActivity.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { AppleModule } from './modules/login/apple/apple.module';
import { FacebookModule } from './modules/login/facebook/facebook.module';
import { InstagramModule } from './modules/login/instagram/instagram.module';
import { InterGroupModule } from './modules/inter-group/interGroup.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CalificationModule } from './modules/calification/calification.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ZoneModule } from './modules/zone/zone.module'


@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {
      useCreateIndex: true,
      useFindAndModify: false
    }),
    ConfigModule.forRoot(),
    UsersModule,
    MeetingPlaceModule,
    RolModule,
    GroupModule,
    ChatModule,
    NotificationModule,
    CloudinaryModule,
    CommentModule,
    TypeOfActivityModule,
    AuthModule,
    EmailModule,
    AppleModule,
    FacebookModule,
    InstagramModule,
    InterGroupModule,
    ContactsModule,
    ZoneModule,
    CalificationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
