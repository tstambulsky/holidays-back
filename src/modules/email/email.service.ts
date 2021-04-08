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
        subject: 'Recuperar contraseña',
        html: `<h2>Por favor copie los caractéres y no los comparta con nadie.</h2>
        <h3>Este es el codigo que usted necesita para poder cambiar la contraseña.</h3><h2><strong>${code}</strong></h2>`
      }
      await this.sendEmail(message);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
