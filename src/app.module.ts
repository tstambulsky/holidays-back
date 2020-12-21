import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MeetingPlaceModule } from './meeting-place/meeting-place.module';
import { ZoneModule } from './zone/zone.module';
import { ScreenModule } from './screen/screen.module';
import { LocationModule } from './location/location.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { RolModule } from './rol/rol.module';
import { GroupModule } from './group/group.module';
import { SearchGroupModule } from './search-group/search-group.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : `.development.env`
        }),
        MongooseModule.forRoot(`mongodb://${process.env.MONGO_DB_DATABASE_URL}`, { useNewUrlParser: true }),
        UsersModule,
        MeetingPlaceModule,
        ZoneModule,
        ScreenModule,
        LocationModule,
        ChatModule,
        MessageModule,
        RolModule,
        GroupModule,
        SearchGroupModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
