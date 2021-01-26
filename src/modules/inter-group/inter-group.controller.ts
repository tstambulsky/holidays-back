import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { InterGroupService } from './inter-group.service';
import { InterGroup } from './schema/inter-group.schema';
import { InterGroupDTO, UpdateInterGroupDTO } from './dto/inter-group.dto';

@Controller('inter-group')
export class InterGroupController {
  constructor(private readonly interGroupService: InterGroupService) {}

  @Get()
  async getInterGroups(@Res() res): Promise<InterGroup[]> {
    try {
      const interGroups = await this.interGroupService.getInterGroups();
      return res.status(HttpStatus.OK).json({
        message: 'List of Inter Groups',
        interGroups
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/:interGgroupID')
  async getInterGroup(@Res() res, @Param('interGroupID') interGroupID) {
    try {
      const interGroup = await this.interGroupService.getInterGroup(interGroupID);
      if (!interGroup) throw new NotFoundException('Inter Group does not exists');
      return res.status(HttpStatus.OK).json(interGroup);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Post()
  async createInterGroup(@Res() res, @Body() createInterGroupDTO: InterGroupDTO): Promise<string> {
    try {
      await this.interGroupService.createInterGroup(createInterGroupDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Inter Group has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/update/:interGroupID')
  async updateInterGroup(
    @Res() res,
    @Param('interGroupID') interGroupID,
    @Body() updateInterGroupDTO: UpdateInterGroupDTO
  ): Promise<InterGroup> {
    try {
      const updateInterGroup = await this.interGroupService.updateInterGroup(interGroupID, updateInterGroupDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Inter Group has been updated',
        interGroup: updateInterGroup
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/delete/:interGroupID')
  async deleteInterGroup(@Res() res, @Param('groupID') interGroupID): Promise<string> {
    try {
      await this.interGroupService.deleteInterGroup(interGroupID);
      return res.status(HttpStatus.OK).json({
        message: 'Inter Group deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }
}
