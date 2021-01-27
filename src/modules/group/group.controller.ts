import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './schema/group.schema';
import { GroupDTO, UpdateGroupDTO } from './dto/group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroups(@Res() res): Promise<Group[]> {
    try {
      const groups = await this.groupService.getGroups();
      return res.status(HttpStatus.OK).json({
        message: 'List of Groups',
        groups
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/:groupID')
  async getGroup(@Res() res, @Param('groupID') groupID) {
    try {
      const group = await this.groupService.getGroup(groupID);
      if (!group) throw new NotFoundException('Group does not exists');
      return res.status(HttpStatus.OK).json(group);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Post()
  async createGroup(@Res() res, @Body() createGroupDTO: GroupDTO): Promise<string> {
    try {
      await this.groupService.createGroup(createGroupDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Group has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/update/:groupID')
  async updateGroup(@Res() res, @Param('groupID') groupID, @Body() updateGroupDTO: UpdateGroupDTO): Promise<Group> {
    try {
      const updateGroup = await this.groupService.updateGroup(groupID, updateGroupDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Group has been updated',
        Group: updateGroup
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/delete/:groupID')
  async deleteGroup(@Res() res, @Param('groupID') groupID): Promise<string> {
    try {
      await this.groupService.deleteGroup(groupID);
      return res.status(HttpStatus.OK).json({
        message: 'Group deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }
}
