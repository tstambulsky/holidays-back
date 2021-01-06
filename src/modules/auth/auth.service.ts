import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashSync, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { LoginResDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { RegisterResDTO } from './dto/register.dto';
import { User } from '../users/schema/users.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new Error('Sorry, User not found');
    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Sorry, invalid password');
    return user;
  }

  async login(data: LoginDTO) {
    const { email, password } = data;
    try {
      const userLoged = await this.validateUser(email, password);
      const payload = { email: userLoged.email };
      return {
        token: this.jwtService.sign(payload),
        user: userLoged
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async registerUser(data: RegisterDTO){
    try {
      const {
        name,
        lastName,
        DNI,
        email,
        birthDate,
        phoneNumber,
        password,
        addressStreet,
        addressNumber,
        addressFloor,
        addressApartment
      } = data;
      const userExist = await this.userService.getUserByEmail(email);
      if (userExist) return { response: 'User already exist' };
      const hashPassword = await hashSync(password, 12);
      const user = await this.userService.createUser({
        name,
        lastName,
        DNI,
        email,
        birthDate,
        phoneNumber,
        password: hashPassword,
        addressStreet,
        addressNumber,
        addressFloor,
        addressApartment
      });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
