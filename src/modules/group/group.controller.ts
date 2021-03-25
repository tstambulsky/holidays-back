import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { GroupService } from './group.service';
import { Group } from './schema/group.schema';
import {
  GroupDTO,
  UpdateGroupDTO,
  QueryDTO,
  RequestToGroupDTO,
  AceptOrRefuseDTO,
  SearchByDistanceDto,
  NewAdminDto,
  EditPhotosDto,
  FiltersDTO
} from './dto/group.dto';
import { CurrentUser } from '../users/decorators/currentUser';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { contactsDTO } from '../users/dto/data.dto';
import { multerOptions } from '../../config/multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@UseGuards(JwtAuthGuard)
@Controller('/api/group')
export class GroupController {
  constructor(private readonly groupService: GroupService,
    private readonly _cloudinaryService: CloudinaryService) {}

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

  @Get('/:groupId')
  async getGroup(@Res() res, @Param('groupId') groupId) {
    try {
      const group = await this.groupService.getGroup(groupId);
      if (!group) throw new NotFoundException('Group does not exists');
      return res.status(HttpStatus.OK).json(group);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/search/gender')
  async filterSearch(@Res() res, @Query() filters: QueryDTO): Promise<Group[]> {
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
  async filterAge(@Res() res, @Query() filters: QueryDTO): Promise<Group[]> {
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

  @Get('/search/typeactivity')
  async getGroupActivity(@Res() res, @Query() filters: QueryDTO): Promise<Group[]> {
    try {
      const getGroup = await this.groupService.searchGroupByActivity(filters.activity);
      return res.status(HttpStatus.OK).json({
        message: 'List of groups',
        groups: getGroup
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/search/name')
  async getGroupName(@Res() res, @Query() filters: QueryDTO): Promise<Group[]> {
    try {
      const getGroup = await this.groupService.searchGroupByName(filters.name);
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
  async createGroup(@Res() res, @Body() createGroupDTO: GroupDTO, @CurrentUser() user): Promise<Group> {
    try {
      const group = await this.groupService.createGroup(createGroupDTO, user);
      return res.status(HttpStatus.OK).json({
        message: 'Group has been created',
        group
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/repeatgroup/:groupId')
  async repeatGroup(@Res() res, @Param('groupId') groupId: string, @CurrentUser() user): Promise<Group> {
    try {
      const group = await this.groupService.repeatGroup(groupId, user);
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

  @Get('/previousgroups/user')
  async previouslyGroups(@Res() res, @CurrentUser() user): Promise<Group[]> {
    try {
      const group = await this.groupService.previousGroups(user);
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

  @Put('/update/:groupId')
  async updateGroup(@Res() res, @Param('groupId') groupId, @Body() updateGroupDTO: UpdateGroupDTO, @CurrentUser() user): Promise<Group> {
    try {
      const updateGroup = await this.groupService.updateGroup(groupId, updateGroupDTO, user);
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

  @Delete('/delete/:groupId')
  async deleteGroup(@Res() res, @Param('groupId') groupId): Promise<string> {
    try {
      await this.groupService.deleteGroup(groupId);
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

  @Put('/remove/:groupId')
  async inactiveGroup(@Res() res, @Param('groupId') groupId): Promise<string> {
    try {
      await this.groupService.toInactiveGroup(groupId);
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

  @Post('/invitation/create')
  async sendInvitation(@Res() res, @Body() data: RequestToGroupDTO) {
    try {
      const group = await this.groupService.sendInvitationToGroup(data);
      return res.status(HttpStatus.OK).json({
        message: 'Invitation has been send!',
        group
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/invitation/:groupId')
  async getInvitations(@Res() res, @Param('groupId') groupId) {
    try {
      const response = await this.groupService.getInvitationToGroup(groupId);
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
      const response = await this.groupService.acceptInvitationToGroup(data, user);
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
  async refuseInvitation(@Res() res, @Body() data: AceptOrRefuseDTO, @CurrentUser() user) {
    try {
      const response = await this.groupService.refuseInvitationToGroup(data, user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  /*@Post('/invitation/usertoadmin')
  async sendInvitationToAdmin(@Res() res, @Body() data: RequestToGroupDTO, @CurrentUser() user) {
    try {
      const response = await this.groupService.requestToJoinGroup(user, data);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      })
    }
  }*/

  @Get('/request/user')
  async getMyRequestsToJoinGroup(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.groupService.getMyRequestsToJoinGroup(user);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: error.message
      });
    }
  }

  @Post('/request/state')
  async acceptOrRefuseRequest(@Res() res, @Body() data: AceptOrRefuseDTO, @CurrentUser() user) {
    try {
      const response = await this.groupService.acceptOrRefuseMyRequests(data, user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: error.message
      });
    }
  }

  @Get('/groupsuser/user')
  async getGroupsByUser(@Res() res, @CurrentUser() user) {
    try {
      const groups = await this.groupService.getUserGroups(user);
      return res.status(HttpStatus.OK).json({
        message: 'List of groups',
        groups
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        err: err.message
      });
    }
  }

  @Get('/search/distance')
  async searchByDistance(@Res() res, @Query() distance: SearchByDistanceDto, @CurrentUser() user): Promise<Group[]> {
    try {
      const getGroup = await this.groupService.searchByDistance(user, distance.distance);
      return res.status(HttpStatus.OK).json({
        message: 'List of groups',
        groups: getGroup
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Post('/new/admin')
  async newAdmin(@Res() res, @Body() data: NewAdminDto, @CurrentUser() user): Promise<string> {
    try {
      const response = await this.groupService.setNewAdmin(data, user);
      return res.status(HttpStatus.OK).json({
        message: 'Admin seted',
        response
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: error.message
      });
    }
  }

  @Post('/update/photo/:groupId')
  async groupPhoto(@Res() res, @Param('groupId') groupId, @Body() file: any, @CurrentUser() user) {
    try {
      const response = await this.groupService.setGroupPhoto(user, groupId, file);
      return res.status(HttpStatus.OK).json({
        message: 'Photo updated',
        response
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        error: error.message
      });
    }
  }

  @Post('/photo/:groupId')
  @UseInterceptors(FileInterceptor('file', multerOptions
  ))
  async uploadPhotoProfile(@CurrentUser() user, @Param('groupId') groupId, @UploadedFile() file) {
    await this.groupService.setGroupPhoto(user, groupId, file);
    await this._cloudinaryService.upload(file.path);
}

  @Get('/groupsuser/createdbyuser')
  async getGroupsCreatedByUser(@Res() res, @CurrentUser() user) {
  try {
    const response = await this.groupService.groupsCreatedByUser(user)
    return res.status(HttpStatus.OK).json({
      message: 'List of groups',
      response
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: error.message
    })
  }
  }

  @Get('/groups/nearby')
  async getNearbyGroups(@Res() res, @CurrentUser() user) {
    try {
      const response = await this.groupService.nearbyGroups(user);
      return res.status(HttpStatus.OK).json({
        response
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      })
    }
  }

  @Post('/groups/contacts')
  @UseInterceptors(new SizeLimitInterceptor(1024 * 1024 * 10))
  async getGroupsOfMyContacts(@Res() res, @Body() users: contactsDTO) {
    try {
      const getGroups = await this.groupService.groupsOfMyContacts(users.users)
      return res.status(HttpStatus.OK).json({
        getGroups
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        error: error.message
      });
    }
  }

  @Get('/groups/photo/:fileId')
  async servePhoto(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'assets'});
  }

  
  /* @Get('/groups/filters')
  async getGroupsByFilters(@Res() res, @Query() data: FiltersDTO, @CurrentUser() user) {
  try {
    const getFilters = await this.groupService.threeFilters(data.gender, data.distance, data.age, user);
    return res.status(HttpStatus.OK).json({
      getFilters
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      error: error.message
    });
  }
}*/
}
