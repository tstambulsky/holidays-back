import { Injectable, Inject } from '@nestjs/common';
import { Cloudinary } from './cloudinary.provider';
import { cloudinaryConfig } from '../../config/cloudinary';
@Injectable()
export class CloudinaryService {
  private v2: any;
  constructor(
    @Inject(Cloudinary)
    private cloudinary
  ) {
    this.cloudinary.v2.config({
      cloud_name: cloudinaryConfig.CLOUDINARY_NAME,
      api_key: cloudinaryConfig.CLOUDINARY_API_KEY,
      api_secret: cloudinaryConfig.CLOUDINARY_API_SECRET
    });
    this.v2 = cloudinary.v2;
  }
  async upload(file: any) {
    try {
      const data = await this.v2.uploader.upload(file);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
