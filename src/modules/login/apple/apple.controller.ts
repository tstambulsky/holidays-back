import { Controller, Get, Post, Body, ForbiddenException } from '@nestjs/common';
import { AppleService } from './apple.service';

@Controller()
export class AppleController {
  constructor(private readonly appleService: AppleService) {}
  @Post('/apple')
  public async appleLogin(@Body() payload: any): Promise<any> {
    console.log('Received', payload);
    if (!payload.code) {
      throw new ForbiddenException();
    }

    return this.appleService.verifyUser(payload);
  }
}
