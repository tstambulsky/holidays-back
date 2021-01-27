import { Module } from '@nestjs/common';
import { AppleService } from './apple.service';

@Module({
  imports: [],
  providers: [AppleService]
})
export class AppleModule {}
