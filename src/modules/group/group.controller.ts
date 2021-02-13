import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './schema/group.schema';
import { GroupDTO, UpdateGroupDTO, queryDTO } from './dto/group.dto';

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

  @Get('/search/filters')
  async filterSearch(@Res() res, @Query() filters: queryDTO): Promise<Group[]> {
    try {
      const groups = await this.groupService.genderFilter(filters.gender);
      return res.status(HttpStatus.OK).json({
        groups: groups
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/search/age')
  async filterAge(@Res() res, @Query() filters: queryDTO): Promise<Group[]> {
    try {
    const groups = await this.groupService.ageFilter(filters.age);
   return res.status(HttpStatus.OK).json({
        groups: groups
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/typeActivity/')
  async getGroupActivity(@Res() res, @Query() activity) {
    try {
      const getGroup = await this.groupService.searchGroupByActivity(activity);
      if (!getGroup) throw new NotFoundException('No results found');
      return res.status(HttpStatus.OK).json(getGroup);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/search/')
  async getGroupName(@Res() res, @Query() name) {
    try {
      const getGroup = await this.groupService.searchGroupByName(name);
      if (!getGroup) throw new NotFoundException('No results found');
      return res.status(HttpStatus.OK).json(getGroup);
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

  @Put('/repeatGroup/:groupID')
  async repeatGroup(@Res() res, @Param('groupID') groupID: string): Promise<Group> {
    try {
      const group = await this.groupService.repeatGroup(groupID);
      return res.status(HttpStatus.OK).json({
        message: 'Group is reactivated!',
        group
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Get('/previousGroups/:userID')
  async previouslyGroups(@Res() res, @Param('userID') userID: string): Promise<Group[]> {
    try {
      const group = await this.groupService.previousGroups(userID);
      return res.status(HttpStatus.OK).json({
        message: 'Previous groups!',
        group
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
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
        message: err.message,
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
        message: err.message,
        err: err.message
      });
    }
  }

  @Put('/remove/:groupID')
  async inactiveGroup(@Res() res, @Param('groupID') groupID): Promise<string> {
    try {
      await this.groupService.toInactiveGroup(groupID);
      return res.status(HttpStatus.OK).json({
        message: 'Group removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
        err: err.message
      });
    }
  }
}
