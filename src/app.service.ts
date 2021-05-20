import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const time = new Date();
    console.log(time);
    return 'Hello, this url is the home of our api, which is used only in mobile applications.';
  }
}
