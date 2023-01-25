import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: email,
      subject: '가입완료',
      html: `<a href="${url}" target="_blank">가입확인</a>`,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
