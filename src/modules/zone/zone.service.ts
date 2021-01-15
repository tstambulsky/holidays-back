import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCityDTO, UpdateCityDTO, CreateStateDTO, UpdateStateDTO, CreateCountryDTO, UpdateCountryDTO } from './dto/zone.dto';
import { City, CityDocument } from './schema/city.schema';
import { State, StateDocument } from './schema/state.schema';
import { Country, CountryDocument } from './schema/country.schema';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel(City.name) private readonly cityModel: Model<CityDocument>,
    @InjectModel(State.name) private readonly stateModel: Model<StateDocument>,
    @InjectModel(Country.name) private readonly countryModel: Model<CountryDocument>
  ) {}

  async getCities(): Promise<City[]> {
    const cities = await this.cityModel.find({ active: true });
    if (!cities) {
      throw new HttpException('Not Found', 404);
    }
    return cities;
  }

  async getCity(cityID: any): Promise<City> {
    try {
      const city = await this.cityModel.findOne({ _id: cityID }, { active: true });
      console.log(city);
      return city;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createCity(cityDTO: CreateCityDTO): Promise<string> {
    try {
      const city = await new this.cityModel(cityDTO);
      await city.save();
      return 'City created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateCity(cityID: any, data: UpdateCityDTO): Promise<City | undefined> {
    try {
      await this.cityModel.update(cityID, { ...data });
      const city = await this.cityModel.findOne(cityID);
      return city;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteCity(cityID: any): Promise<string> {
    try {
      await this.cityModel.remove(cityID);
      return 'City deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveCity(cityID: any): Promise<string> {
    try {
      const city = await this.cityModel.findById(cityID);
      if (!city) {
        throw new HttpException('Not Found', 404);
      }
      city.active = false;
      await city.save();
      return 'City change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getStates(): Promise<State[]> {
    const states = await this.stateModel.find({ active: true });
    if (!states) {
      throw new HttpException('Not Found', 404);
    }
    return states;
  }

  async getState(stateID: any): Promise<State> {
    try {
      const state = await this.stateModel.findOne({ _id: stateID }, { active: true });
      console.log(state);
      return state;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createState(stateDTO: CreateStateDTO): Promise<string> {
    try {
      const state = await new this.stateModel(stateDTO);
      await state.save();
      return 'State created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateState(stateID: any, data: UpdateStateDTO): Promise<State | undefined> {
    try {
      await this.stateModel.update(stateID, { ...data });
      const state = await this.stateModel.findOne(stateID);
      return state;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteState(stateID: any): Promise<string> {
    try {
      await this.stateModel.remove(stateID);
      return 'State deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveState(stateID: any): Promise<string> {
    try {
      const state = await this.stateModel.findById(stateID);
      if (!state) {
        throw new HttpException('Not Found', 404);
      }
      state.active = false;
      await state.save();
      return 'State change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getCountries(): Promise<Country[]> {
    try {
      const countries = await this.countryModel.find({ active: true });
      return countries;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getCountry(countryID: any): Promise<Country> {
    try {
      const country = await this.countryModel.findOne({ _id: countryID }, { active: true });
      console.log(country);
      return country;
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }

  async createCountry(countryDTO: CreateCountryDTO): Promise<string> {
    const { name } = countryDTO;
    try {
      const exist = await this.countryModel.findOne({ name: name });
      if (exist) {
        throw new HttpException('Country already exist', 404);
      } else {
        const country = await new this.countryModel(countryDTO);
        await country.save();
      }
      return 'Country created';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateCountry(countryID: any, data: UpdateCountryDTO): Promise<Country | undefined> {
    try {
      await this.countryModel.update(countryID, { ...data });
      const country = await this.countryModel.findOne(countryID);
      return country;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteCountry(countryID: any): Promise<string> {
    try {
      await this.countryModel.remove(countryID);
      return 'Country deleted';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async toInactiveCountry(countryID: any): Promise<string> {
    try {
      const country = await this.countryModel.findById(countryID);
      if (!country) {
        throw new HttpException('Not Found', 404);
      }
      country.active = false;
      await country.save();
      return 'Country change to inactive';
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
