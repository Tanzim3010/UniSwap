import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: Number(process.env.MAILER_PORT),
    secure: false,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAILER_FROM,
        to: email,
        subject: 'Verify your UniSwap email',
        text: `Your verification token is:\n\n${token}\n\nThis token expires in 15 minutes.`,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}