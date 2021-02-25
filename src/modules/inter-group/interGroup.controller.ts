import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { InterGroupService } from './interGroup.service';
import { InterGroup } from './schema/interGroup.schema';
import { InterGroupDTO, UpdateInterGroupDTO, RequestGroupToGroupDTO, AceptOrRefuseDTO } from './dto/interGroup.dto';

@Controller('interGroup')
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

  @Post('/invitation/create')
  async sendInvitation(@Res() res, @Body() data:RequestGroupToGroupDTO) {
    try {
      const interGroup = await this.interGroupService.sendInvitationToOtherGroup(data);
      return res.status(HttpStatus.OK).json({
        message: 'Invitation has been send!',
        interGroup
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/invitation/:interGroupID')
  async getInvitations(@Res() res, @Param('interGroupID') interGroupID) {
    try {
      const response = await this.interGroupService.getInvitationGroupToGroup(interGroupID);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      })
    }
  }

  @Post('/invitation/success')
  async acceptInvitation(@Res() res, @Body() data: AceptOrRefuseDTO) {
    try {
      const response = await this.interGroupService.acceptInvitationGroupToGroup(data);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Post('/invitation/refuse')
  async refuseInvitation(@Res() res, @Body() data: AceptOrRefuseDTO) {
    try {
      const response = await this.interGroupService.refuseInvitationGroupToGroup(data);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }
}
