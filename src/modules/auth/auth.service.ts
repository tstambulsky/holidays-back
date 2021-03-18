import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { EmailService } from '../email/email.service';
import { TokenPayload } from './interfaces/facebook-config.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { tokenConfig } from '../../config/token';



@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailService: EmailService,
    readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

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
      const payload = { email: userLoged.email, _id: userLoged._id };
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
      const ifExist = await this.userService.getUserById({active: true, email: data.email});
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
      const code = await this.recoverToken(email);
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
      const tokenCode = await this.jwtService.verify(code);
      if (!tokenCode) throw new Error('Expired Code');
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
      const code = user.passwordRecover;
      const tokenCode = await this.jwtService.verify(code!);
      if (!tokenCode) throw new Error('Password change not allowed');
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
}
