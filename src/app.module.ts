import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { MeetingPlaceModule } from './modules/meeting-place/meeting-place.module';
import { ZoneModule } from './modules/zone/zone.module';
import { ImageModule } from './modules/image/image.module';
import { LocationModule } from './modules/location/location.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { RolModule } from './modules/rol/rol.module';
import { GroupModule } from './modules/group/group.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CommentModule } from './modules/comment/comment.module';
import { LikesModule } from './modules/likes/likes.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    }),
    UsersModule,
    MeetingPlaceModule,
    ZoneModule,
    ImageModule,
    LocationModule,
    ChatModule,
    MessageModule,
    RolModule,
    GroupModule,
    NotificationModule,
    CommentModule,
    LikesModule,
    ParticipantsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
