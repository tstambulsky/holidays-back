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

  async sendRecoveryPassword(email: string, code: string) {
    try {
      const url = emailConfig.url + code;
      const message = {
        from: 'Traiiner',
        to: email,
        suject: 'Recover Password',
        text: 'Click on the link to complete the password change',
        html: `<b>YOUR CODE</b> <br> <a href='#'>${url}</a>`
      }
      await this.sendEmail(message);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
