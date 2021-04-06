import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig } from '../../config/email';

@Injectable()
export class EmailService {
  async sendEmail(message: any) {
    try {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.password
        }
      });
      await transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('info', info);
        }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async sendRecoveryPassword(email: string, code: any) {
    try {
      const message = {
        from: 'Traiiner',
        to: email,
        subject: 'Recover Password',
        html: `<h3>Please copy these numbers and do not share them with anyone.</h3>
        <b>This is your code to change your password.</b> <br> <strong>${code}</strong>`
      }
      await this.sendEmail(message);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
