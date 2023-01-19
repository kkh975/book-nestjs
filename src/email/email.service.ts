import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gamil',
      auth: {
        user: '',
        pass: '',
      },
    });
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    const baseUrl = 'http://localhost:3000';
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: email,
      subject: '가입완료',
      html: `<a href="${url}" target="_blank">가입확인</a>`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
