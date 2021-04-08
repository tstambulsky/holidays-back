import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { InterGroupService } from './interGroup.service';
import { InterGroup } from './schema/interGroup.schema';
import {
  UpdateInterGroupDTO,
  RequestGroupToGroupDTO,
  AceptOrRefuseDTO,
  newProposalDto,
  acceptOrRefuseProposalDto
} from './dto/interGroup.dto';
import { CurrentUser } from '../users/decorators/currentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/api/intergroup')
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

  @Get('/:intergroupID')
  async getInterGroup(@Res() res, @Param('intergroupID') intergroupID) {
    try {
      const interGroup = await this.interGroupService.getInterGroup(intergroupID);
      if (!interGroup) throw new NotFoundException('Inter Group does not exists');
      return res.status(HttpStatus.OK).json(interGroup);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Put('/update/:intergroupID')
  async updateInterGroup(
    @Res() res,
    @Param('intergroupID') intergroupID,
    @Body() updateInterGroupDTO: UpdateInterGroupDTO,
    @CurrentUser() user
  ): Promise<InterGroup> {
    try {
      const updateInterGroup = await this.interGroupService.updateInterGroup(intergroupID, updateInterGroupDTO, user);
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

   @Put('/remove/:interGroupID')
  async inactiveInterGroup(@Res() res, @Param('interGroupID') interGroupID): Promise<string> {
    try {
      await this.interGroupService.toInactiveInterGroup(interGroupID);
      return res.status(HttpStatus.OK).json({
        message: 'InterGroup removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        err: err.message
      });
    }
  }

  @Delete('/delete/:intergroupID')
  async deleteInterGroup(@Res() res, @Param('intergroupID') intergroupID): Promise<string> {
    try {
      await this.interGroupService.deleteInterGroup(intergroupID);
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
  async sendInvitation(@Res() res, @Body() data: RequestGroupToGroupDTO, @CurrentUser() user) {
    try {
      const interGroup = await this.interGroupService.sendInvitationToOtherGroup(data, user);
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
      });
    }
  }

  @Post('/invitation/success')
  async acceptInvitation(@Res() res, @Body() data: AceptOrRefuseDTO, @CurrentUser() user) {
    try {
      const response = await this.interGroupService.acceptInvitationGroupToGroup(data, user);
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
  async refuseInvitation(@Res() res, @Body() data: AceptOrRefuseDTO,  @CurrentUser() user) {
    try {
      const response = await this.interGroupService.refuseInvitationGroupToGroup(data, user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/needproposal/:groupId') 
    async needProposal(@Res() res, @Param('groupId') groupId: any) {
      try {
        const response = await this.interGroupService.getInterGroupWithoutProposal(groupId);
        return res.status(HttpStatus.OK).json({
          response
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: error.message
        });
      }
    }

  @Post('/invitation/proposal')
  async createProposalPlace(@Res() res, @Body() data: newProposalDto, @CurrentUser() user) {
    try {
      const response = await this.interGroupService.proposalDateAndPlace(data, user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/invitation/proposal/:intergroupId')
  async getProposalsByIntergroup(@Res() res, @Param('intergroupId') intergroupId) {
    try {
      const response = await this.interGroupService.getProposalsInterGroup(intergroupId);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Post('/invitation/proposal/state')
  async acceptOrRefuseProposal(@Res() res, @Body() data: acceptOrRefuseProposalDto, @CurrentUser() user) {
    try {
      const response = await this.interGroupService.acceptOrRefuseProposal(data, user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/user/user')
  async getMyIntergroups(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.interGroupService.getMyIntergroups(user);
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
