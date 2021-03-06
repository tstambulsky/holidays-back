import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly emailService: EmailService, readonly jwtService: JwtService) {}

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

  async registerUser(data: RegisterDTO) {
    const { name, lastName, DNI, email, phoneNumber, password, address } = data;
    try {
      const userExist = await this.userService.getUserByEmail(email);
      if (userExist) return { response: 'User already exist' };
      const hashPassword = await hash(password, 12);
      const user = await this.userService.createUser({
        name,
        lastName,
        DNI,
        email,
        phoneNumber,
        password: hashPassword,
        address
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
      console.log();
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
