import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, this url is the home of our api, which is used only in mobile applications.';
  }
}
