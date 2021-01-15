import { Controller, Param, Get, ParseIntPipe } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { InstagramService } from './instagram.service';

@Controller('media')
export class InstagramController {
  constructor(private instagramService: InstagramService) {}

  @Get('/:mediaId')
  getMediaById(
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ): Promise<AxiosResponse> {
    return this.instagramService.getMediaById(mediaId);
  }

  @Get('/:mediaId/children')
  getChildrenOfMediaById(
    @Param('mediaId', ParseIntPipe) mediaId: number,
  ): Promise<AxiosResponse> {
    return this.instagramService.getChildrenOfMediaById(mediaId);
  }
 }