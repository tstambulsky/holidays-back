import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOfActivity, TypeOfActivitySchema } from './schema/typeOfActivity.schema';
import { TypeOfActivityController } from './typeOfActivity.controller';
import { TypeOfActivityService } from './typeOfActivity.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: TypeOfActivity.name , schema: TypeOfActivitySchema}])],
	providers: [TypeOfActivityService],
	controllers: [TypeOfActivityController]
})
export class TypeOfActivityModule {}
