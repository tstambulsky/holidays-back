import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class InstagramService {
  constructor(private httpService: HttpService) {}

  async getMediaById(mediaId): Promise<AxiosResponse> {
    try {
      const response = await this.httpService
        .get(`/${mediaId}`, {
          params: {
            access_token: process.env.CLIENT_SECRET_INSTAGRAM,
            fields: 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username'
          }
        })
        .toPromise();
      return response.data;
    } catch (error) {
      const { status, statusText } = error.response;
      throw new HttpException(statusText, status);
    }
  }

  async getChildrenOfMediaById(mediaId): Promise<AxiosResponse> {
    try {
      const response = await this.httpService
        .get(`/${mediaId}/children`, {
          params: {
            access_token: process.env.CLIENT_SECRET_INSTAGRAM,
            fields: 'caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username'
          }
        })
        .toPromise();
      return response.data;
    } catch (error) {
      const { status, statusText } = error.response;
      throw new HttpException(statusText, status);
    }
  }
}
