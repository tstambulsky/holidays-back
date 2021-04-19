import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { EmailService } from '../email/email.service';
import { TokenPayload } from './interfaces/facebook-config.interface';
import { tokenConfig } from '../../config/token';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
    private readonly emailService: EmailService,
    readonly jwtService: JwtService  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new Error('Sorry, User not found');
    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Sorry, invalid password');
    return user;
  }

  async validateUserSocial(email: string, provider: any): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new Error('Sorry, User not found');
    if (user.provider_id !== provider) throw new Error ('Sorry, the user does not have the privileges to access at this app');
    return user;
  }

  async login(data: LoginDTO) {
    const { email, password } = data;
    try {
      const userLoged = await this.validateUser(email, password);
      const payload = { email: userLoged.email, _id: userLoged._id };
      return {
        token: this.jwtService.sign(payload),
        user: userLoged
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async loginSocial(email: string, provider: any) {
    try {
      const userLoged = await this.validateUserSocial(email, provider);
      const payload = { email: userLoged.email, _id: userLoged._id };
      console.log('payloadpayload', payload);
      return {
        token: this.jwtService.sign(payload),
        user: userLoged
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = await this.jwtService.verify(token, {
      secret: tokenConfig.secretKey
    });
    if (payload) {
      return this.userService.getUserById(payload._id);
    }
  }

  async registerUser(data: RegisterDTO) {
    const { name, lastName, DNI, email, phoneNumber, password, address, birthDate, city, state, sex, isAdmin, latitude, longitude } = data;
    try {
      const ifExist = await this.userService.getUserByEmail(email);
      if (ifExist) throw new HttpException('Email already exist', 404);
      const hashPassword = await hash(password, 12);
      const user = await this.userService.createUser({
        name,
        lastName,
        DNI,
        email,
        phoneNumber,
        password: hashPassword,
        address,
        birthDate,
        city,
        state,
        sex,
        isAdmin,
        latitude,
        longitude
      });
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async recoverToken(email: string) {
    try {
      return await this.jwtService.sign({ email: email });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendRecoverPassword(email: string) {
    try {
      const code = Math.random().toString(36).slice(-5);
      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new Error('User not exist');
      user.passwordRecover = code;
      await user.save();
      await this.emailService.sendRecoveryPassword(email, code);
      return 'Email sended';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async recoverPassword(code: string) {
    try {
      //const tokenCode = await this.jwtService.verify(code);
      //if (!tokenCode) throw new Error('Expired Code');
      const user = await this.userService.findOneUser({ passwordRecover: code });
      if (!user) throw new Error('The code is wrong');
      user.confirmPasswordRecover = true;
      await user.save();
      return 'Confirmed code!';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async changePassword(email: string, password: string) {
    try {
      const user = await this.userService.findOneUser({ email: email });
      if (!user) throw new Error('User does not exist');
      const hashPassword = await hash(password, 10);
      user.password = hashPassword;
      user.confirmPasswordRecover = false;
      user.passwordRecover = '';
      await user.save();
      return 'The password change has been made successfully';
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async socialLogin(providerId: any, provider: any) {
     try {
      const user = await this.userService.findOneUser({ provider_id: providerId, provider, active: true });
      if (!user) {
        throw new HttpException('You do not registered in this app', 404);
      }
      if (user) {
        return 'Welcome to the Holidays App!'
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
