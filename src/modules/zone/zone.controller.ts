import { Controller, Get, Put, Delete, Res, HttpStatus, Body, Query, Param, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ZoneService } from './zone.service';
import { CreateCityDTO, UpdateCityDTO, CreateStateDTO, UpdateStateDTO, CreateCountryDTO, UpdateCountryDTO } from './dto/zone.dto';
import { IZone } from './interfaces/zone.interface';
import { City } from './schema/city.schema';
import { State } from './schema/state.schema';
import { Country } from './schema/country.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('zone')
export class ZoneController {
  constructor(private zoneService: ZoneService) {}

  @Get('/city')
  async getCities(@Res() res): Promise<City[]> {
    try {
      const cities = await this.zoneService.getCities();
      return res.status(HttpStatus.OK).json({
        message: 'List of Cities',
        cities
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/city/:cityID')
  async getCity(@Res() res, @Param('cityID') cityID) {
    try {
      const city = await this.zoneService.getCity(cityID);
      if (!city) throw new NotFoundException('City does not exists');
      return res.status(HttpStatus.OK).json(city);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Post('/city')
  async createCity(@Res() res, @Body() createCityDTO: CreateCityDTO): Promise<string> {
    try {
      await this.zoneService.createCity(createCityDTO);
      return res.status(HttpStatus.OK).json({
        message: 'City has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/city/update/:cityID')
  async updateCity(@Res() res, @Param('cityID') cityID, @Body() updateCityDTO: UpdateCityDTO): Promise<City> {
    try {
      const updateCity = await this.zoneService.updateCity(cityID, updateCityDTO);
      return res.status(HttpStatus.OK).json({
        message: 'City has been updated',
        City: updateCity
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/city/delete/:cityID')
  async deleteCity(@Res() res, @Param('cityID') cityID): Promise<string> {
    try {
      await this.zoneService.deleteCity(cityID);
      return res.status(HttpStatus.OK).json({
        message: 'City deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Put('/city/remove/:cityID')
  async inactiveCity(@Res() res, @Param('cityID') cityID): Promise<string> {
    try {
      await this.zoneService.toInactiveCity(cityID);
      return res.status(HttpStatus.OK).json({
        message: 'City removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/state')
  async getStates(@Res() res): Promise<State[]> {
    try {
      const states = await this.zoneService.getStates();
      return res.status(HttpStatus.OK).json({
        message: 'List of States',
        states
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/state/:stateID')
  async getState(@Res() res, @Param('stateID') stateID) {
    try {
      const state = await this.zoneService.getState(stateID);
      if (!state) throw new NotFoundException('State does not exists');
      return res.status(HttpStatus.OK).json(state);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error',
        err: err.message
      });
    }
  }

  @Post('/state')
  async craeteState(@Res() res, @Body() createStateDTO: CreateStateDTO): Promise<string> {
    try {
      await this.zoneService.createState(createStateDTO);
      return res.status(HttpStatus.OK).json({
        message: 'State has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/state/update/:stateID')
  async updateState(@Res() res, @Param('stateID') stateID, @Body() updateStateDTO: UpdateStateDTO): Promise<State> {
    try {
      const updateState = await this.zoneService.updateState(stateID, updateStateDTO);
      return res.status(HttpStatus.OK).json({
        message: 'State has been updated',
        State: updateState
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/state/delete/:stateID')
  async deleteState(@Res() res, @Param('stateID') stateID): Promise<string> {
    try {
      await this.zoneService.deleteState(stateID);
      return res.status(HttpStatus.OK).json({
        message: 'State deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Put('/state/remove/:stateID')
  async inactiveState(@Res() res, @Param('stateID') stateID): Promise<string> {
    try {
      await this.zoneService.toInactiveState(stateID);
      return res.status(HttpStatus.OK).json({
        message: 'State removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/country')
  async getCountries(@Res() res): Promise<Country[]> {
    try {
      const country = await this.zoneService.getCountries();
      return res.status(HttpStatus.OK).json({
        message: 'List of Countries',
        country
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Get('/country/:countryID')
  async getCountry(@Res() res, @Param('countryID') countryID) {
    try {
      const country = await this.zoneService.getCountry(countryID);
      if (!country) throw new NotFoundException('Country does not exists');
      return res.status(HttpStatus.OK).json(country);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error',
        err: err.message
      });
    }
  }

  @Post('/country')
  async createCountry(@Res() res, @Body() createCountryDTO: CreateCountryDTO): Promise<string> {
    try {
      await this.zoneService.createCountry(createCountryDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Country has been created'
      });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Put('/country/update/:countryID')
  async updateCountry(@Res() res, @Param('countryID') countryID, @Body() updateCountryDTO: UpdateCountryDTO): Promise<Country> {
    try {
      const updateCountry = await this.zoneService.updateCountry(countryID, updateCountryDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Country has been updated',
        Country: updateCountry
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has occurred',
        err: err.message
      });
    }
  }

  @Delete('/country/delete/:countryID')
  async deleteCountry(@Res() res, @Param('countryID') countryID): Promise<string> {
    try {
      await this.zoneService.deleteCountry(countryID);
      return res.status(HttpStatus.OK).json({
        message: 'Country deleted'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }

  @Put('/country/remove/:countryID')
  async inctiveCountry(@Res() res, @Param('countryID') countryID): Promise<string> {
    try {
      await this.zoneService.toInactiveCountry(countryID);
      return res.status(HttpStatus.OK).json({
        message: 'Country removed'
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'An error has ocurred',
        err: err.message
      });
    }
  }
}
